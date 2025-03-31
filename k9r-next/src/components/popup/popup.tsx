"use client"

import style from "./popup.module.scss";

type PopupProps = {
    close: () => void;
    children: any;
}

const Popup = (props: PopupProps) => {
    return (
        <>
            <div className={style.popup}>
                <div className={style.content}>
                    <button onClick={props.close}>X</button>
                    {props.children}
                </div>
            </div>
        </>
    );
}

export default Popup;