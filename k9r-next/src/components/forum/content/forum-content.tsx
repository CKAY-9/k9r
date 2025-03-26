"use client";

import { Component } from "react";
import style from "./content.module.scss";

type ForumContentProps = {
    children: Component | any;
};

const ForumContent = (props: ForumContentProps) => {
    return (
        <div className={style.forum_content}>
            {props.children}
        </div>
    );
}

export default ForumContent;