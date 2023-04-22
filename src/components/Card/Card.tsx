import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { truncate } from "../../utils/truncate";
import CardStyles from "./Card.module.scss";
import ContextMenu from "../ContextMenu/ContextMenu";
import useToggle from "../../hooks/useToggle";

interface Props {
    title: string;
    content: string;
    date: string;
    textLimit?: number;
}

const Card: React.FC<Props> = ({ title, content, date, textLimit }) => {
    const [expanded, setExpanded] = useToggle();
    const navigate = useNavigate();

    const expand = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        setExpanded();
    };

    return (
        <div onClick={() => navigate("/")} role="button" tabIndex={0} className={CardStyles.card}>
            <div className={CardStyles.heading}>
                <h3>{title}</h3>
                <FontAwesomeIcon icon={faEllipsis} className={CardStyles.options} onClick={expand} />
            </div>
            <p>{truncate(content, textLimit || 400)}</p>

            <span className={CardStyles.date}>{date}</span>
            {expanded && (
                <ContextMenu
                    classRef={CardStyles.context_menu}
                    outsideClick={() => setExpanded(false)}
                    options={[
                        { label: "Pin", onClick: () => {} },
                        { label: "Copy", onClick: () => {} },
                        { label: "Archive", onClick: () => {} },
                        { label: "Delete", onClick: () => {} },
                    ]}
                />
            )}
        </div>
    );
};
export default Card;
