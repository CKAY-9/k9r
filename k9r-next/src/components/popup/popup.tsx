"use client";

import style from "./popup.module.scss";

type PopupProps = {
	close?: () => void;
	children: any;
	remove_padding?: boolean;
};

const Popup = (props: PopupProps) => {
	return (
		<>
			<div className={style.popup}>
				<div
					className={`${style.content} flex col gap-1`}
					style={{ padding: props.remove_padding ? "0" : "initial" }}
				>
					{props.close && <button className="no-border" onClick={props.close}>X</button>}
					{props.children}
				</div>
			</div>
		</>
	);
};

export default Popup;
