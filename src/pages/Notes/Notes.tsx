import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import Card from "../../components/Card/Card";
import Layout from "../../components/Layout/Layout";
import { NotesContext } from "../../context/NotesContext";
import Text from "../../components/Text/Text";
import FloatingIcon from "../../components/FloatingIcon/FloatingIcon";
import { UserContext } from "../../context/UserContext";
import { getNotes } from "../../api/notes";
import Loader from "../../components/Loader/Loader";

const Notes = () => {
    const navigate = useNavigate();
    const { notes } = useContext(NotesContext);
    const { isAuthorized } = useContext(UserContext);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes"],
        queryFn: () => getNotes(1, 15, "desc", "updatedAt"),
        enabled: isAuthorized,
    });
    return (
        <>
            <FloatingIcon icon={faPlus} onClick={() => navigate("/create_note")} />
            <Layout title="Notes" type={isLoading && isAuthorized ? "default" : "masonry"}>
                {!isAuthorized ? (
                    <>
                        {notes?.map((note) => (
                            <Card
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                content={note.content}
                                isPinned={note.isPinned}
                                isArchived={note.isArchived}
                                isDeleted={note.isDeleted}
                                date={note.updatedAt || note.createdAt}
                            />
                        ))}
                        {notes.length < 1 && <Text text="No notes found." type="p" />}
                    </>
                ) : (
                    <>
                        {isLoading && <Loader />}
                        {isError && <Text text="Failed to load notes." type="p" />}
                        {!isLoading &&
                            !isError &&
                            (data?.notes?.length > 0 ? (
                                data?.notes?.map((note) => {
                                    return (
                                        <Card
                                            key={note.id}
                                            id={note.id}
                                            title={note.title}
                                            content={note.content}
                                            isPinned={note.isPinned}
                                            isArchived={note.isArchived}
                                            isDeleted={note.isDeleted}
                                            date={note.updatedAt || note.createdAt}
                                        />
                                    );
                                })
                            ) : (
                                <Text text="No notes found." type="p" />
                            ))}
                    </>
                )}
            </Layout>
        </>
    );
};
export default Notes;
