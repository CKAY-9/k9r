import style from "./container.module.scss";

type ForumContainerProps = {
    children: any;
};

const ForumContainer = (props: ForumContainerProps) => {
    return (
        <main className={`${style.forum_container} flex col gap-1`}> 
            {props.children}
        </main>
    );
}

export default ForumContainer;