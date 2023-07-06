import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotesContext } from "../../context/NotesContext";
import { Note as NoteForm } from "../../models/Note";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import NoteStyles from "./Note.module.scss";
import { UserContext } from "../../context/UserContext";
import { loadNote, moveToBin, updateNote } from "../../api/notes";
import Loader from "../../components/Loader/Loader";
import Text from "../../components/Text/Text";

const Note = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const navigate = useNavigate();
    const { register, setValue, watch } = useForm<NoteForm>();
    const { getLocalNote, updateLocalNote, deleteLocalNote } = useContext(NotesContext);
    const { isAuthorized } = useContext(UserContext);
    const { isLoading, isError } = useQuery({
        queryKey: ["note", params.id],
        queryFn: () => loadNote(`${params.id}`),
        enabled: isAuthorized,
        onSuccess: (data) => {
            setValue("title", data?.note.title);
            setValue("content", data?.note.content);
            document.title = `Pomei | ${data?.note.title || "Untitled"}`;
        },
    });
    const { mutate } = useMutation({
        mutationFn: ({ title, content }: { title: string; content: string }) => updateNote(`${params.id}`, { title, content }),
    });

    const { mutate: moveToBinHandler, isLoading: isMovingToBin } = useMutation({
        mutationFn: (noteId: string) => {
            return toast.promise(moveToBin(noteId), {
                loading: "Moving note to bin...",
                success: (res) => res.status,
                error: (err) => err.response?.data.status,
            });
        },
        onSuccess() {
            queryClient.refetchQueries();
        },
    });

    useEffect(() => {
        if (!isAuthorized) {
            if (!params.id) {
                throw Error("Note not found");
            }
            const note = getLocalNote(params.id);
            if (!note) {
                throw Error("Note not found");
            }
            setValue("title", note?.title);
            setValue("content", note?.content);
            document.title = `Pomei | ${note?.title || "Untitled"}`;
        }

        return () => {
            document.title = "Pomei";
        };
    }, []);

    // const firstUpdate = useRef(true);
    useEffect(() => {
        // if (firstUpdate.current) {
        //     firstUpdate.current = false;
        //     return;
        // }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!isAuthorized) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            watch((value) => updateLocalNote({ ...value, id: getLocalNote(params.id).id, createdAt: getLocalNote(params.id).createdAt }));
        }
        if (isAuthorized) {
            watch((value) => mutate({ title: value.title || "", content: value.content || "" }));
        }
    }, [watch]);

    return (
        <Layout type={isLoading && isAuthorized ? "centered" : null}>
            {!isAuthorized ? (
                <>
                    <section className={NoteStyles.header}>
                        <Input name="title" fontSize={2.5} fontWeight={700} placeholder="Title" styleType="text" register={register} />
                        <Button
                            label="Delete"
                            color="danger"
                            fontSize={1}
                            styleType="text"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => {
                                if (params.id) {
                                    deleteLocalNote(params.id);
                                    navigate("/");
                                }
                            }}
                        />
                    </section>
                    <Textarea name="content" placeholder="Enter your note..." register={register} />
                </>
            ) : (
                <>
                    {isLoading && <Loader />}
                    {isError && <Text text="Failed to load note." type="p" />}
                    {!isLoading && !isError && (
                        <>
                            <section className={NoteStyles.header}>
                                <Input
                                    name="title"
                                    fontSize={2.5}
                                    fontWeight={700}
                                    placeholder="Title"
                                    styleType="text"
                                    register={register}
                                />
                                <Button
                                    label="Delete"
                                    color="danger"
                                    fontSize={1}
                                    styleType="text"
                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                    onClick={() => {
                                        if (params.id) {
                                            moveToBinHandler(params.id);
                                            navigate("/");
                                        }
                                    }}
                                    disabled={isMovingToBin || isLoading}
                                />
                            </section>
                            <Textarea name="content" placeholder="Enter your note..." register={register} />
                        </>
                    )}
                </>
            )}
        </Layout>
    );
};
export default Note;
