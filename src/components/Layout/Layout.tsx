import Styles from "./Layout.module.scss";

interface Props {
    title?: string;
    controls?: JSX.Element;
    type?: "grid" | "masonry" | "centered" | "default" | null;
    className?: string;
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ title, controls, type, className, children }) => {
    return (
        <>
            {(title || controls) && (
                <div className={Styles.header}>
                    {title && <h1 className={Styles.title}>{title}</h1>}
                    {controls && controls}
                </div>
            )}
            <section className={`${className} ${type ? Styles[type] : null}`}>{children}</section>
        </>
    );
};
export default Layout;
