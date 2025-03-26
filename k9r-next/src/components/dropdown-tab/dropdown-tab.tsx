"use client";

import { Component, useState } from "react";
import style from "./dropdown.module.scss";

type DropdownTabProps = {
    children: Component | any;
    title: string;
};

const DropdownTab = (props: DropdownTabProps) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <>
            <div className={style.dropdown_container} onMouseLeave={() => setHover(false)}>
                <span onMouseEnter={() => setHover(true)} className={style.action} style={{
                    "backgroundColor": hover ? "var(--foreground)" : "var(--foreground)",
                    "borderBottomLeftRadius": hover ? "0" : "1rem",
                    "borderBottomRightRadius": hover ? "0" : "1rem",
                    "boxShadow": hover ? "none" : "var(--shdw1)"
                }}>{props.title}</span>
                <div id="postNav" className={style.menu} style={{ 
                    "opacity": hover ? "1" : "0",
                    "display": hover ? "flex" : "none"
                }}>
                    {props.children}
                </div>
            </div>
        </>
    );
}

export default DropdownTab;