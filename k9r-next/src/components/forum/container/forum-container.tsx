import style from "./container.module.scss";

type ForumContainerProps = {
    children: any;
};

const ForumContainer = (props: ForumContainerProps) => {
    return (
        <main className={style.forum_container}> 
            {props.children}
        </main>
    );
}

export default ForumContainer;