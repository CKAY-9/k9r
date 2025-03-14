"use client";

import style from "./content.module.scss";

type ForumContentProps = {
    children: any;
};

const ForumContent = (props: ForumContentProps) => {
    return (
        <div className={style.forum_content}>
            {props.children}
        </div>
    );
}

export default ForumContent;