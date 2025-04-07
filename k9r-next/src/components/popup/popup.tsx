"use client";

import style from "./popup.module.scss";

type PopupProps = {
	close?: () => void;
	children: any;
	remove_padding: boolean;
};

const Popup = (props: PopupProps) => {
	return (
		<>
			<div className={style.popup}>
				<div
					className={style.content}
					style={{ padding: props.remove_padding ? "0" : "initial" }}
				>
					{props.close && <button onClick={props.close}>X</button>}
					{props.children}
				</div>
			</div>
		</>
	);
};

export default Popup;
