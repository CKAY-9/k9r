"use client";

import { BaseSyntheticEvent } from "react";
import MaterialIcon from "../material-icon/material-icon";
import style from "./search.module.scss";

type SearchBarProps = {
	set_search: (search: string) => void;
	search: () => void;
	placeholder?: string;
};

const SearchBar = (props: SearchBarProps) => {
	return (
		<div className={`${style.search_container} flex row`}>
			<input
				type="text"
				placeholder={props.placeholder ? props.placeholder : "Search"}
				className={`${style.search_bar} flex-1`}
				onChange={(e: BaseSyntheticEvent) =>
					props.set_search(e.target.value)
				}
			/>
			<button
				className={`${style.search_button} no-border`}
				onClick={props.search}
			>
				<MaterialIcon
					src="/icons/search.svg"
					alt="Search"
					size_rems={1.5}
				/>
			</button>
		</div>
	);
};

export default SearchBar;
