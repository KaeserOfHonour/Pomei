import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import Styles from "./ContextMenu.module.scss";

interface Props {
    classRef: string;
    options: { label: string; onClick: () => void }[];
    outsideClick?: () => void;
    isVisible: boolean;
}

const ContextMenu: React.FC<Props> = ({ classRef, options, outsideClick, isVisible }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && outsideClick) {
                outsideClick();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    ref={menuRef}
                    className={`${Styles.context_menu} ${classRef}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ul>
                        {options?.map((option) => (
                            <li key={uuid()}>
                                <span onClick={option.onClick} tabIndex={0} role="button">
                                    {option.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default ContextMenu;
