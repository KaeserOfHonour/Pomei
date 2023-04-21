import LayoutStyles from "./Layout.module.scss";

interface Props {
    title?: string;
    controls?: JSX.Element;
    type?: "grid" | "masonry";
    className?: string;
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ title, controls, type, className, children }) => {
    return (
        <>
            <div className={LayoutStyles.header}>
                {title && <h1 className={LayoutStyles.title}>{title}</h1>}
                {controls && controls}
            </div>
            <section
                className={`${LayoutStyles.layout} ${className} ${
                    type === "grid" ? LayoutStyles.grid : type === "masonry" ? LayoutStyles.masonry : ""
                }`}
            >
                {children}
            </section>
        </>
    );
};
export default Layout;
