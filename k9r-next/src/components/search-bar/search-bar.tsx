"use client";

import MaterialIcon from "../material-icon/material-icon";
import style from "./search.module.scss";

type SearchBarProps = {
	set_search: Function;
	search: Function;
	placeholder?: string;
};

const SearchBar = (props: SearchBarProps) => {
	return (
		<div className={style.search_container}>
			<input
				type="text"
				placeholder={props.placeholder ? props.placeholder : "Search"}
				className={style.search_bar}
			/>
			<button className={style.search_button} onClick={props.search}>
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
