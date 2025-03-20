"use client";

import { User } from "@/api/users/models";
import { BaseSyntheticEvent, useState } from "react";
import style from "./users.module.scss";

const UsersAdmin = () => {
    const [search_query, setSearchQuery] = useState<string>("");
    const [user_results, setUserResults] = useState<User[]>([]);

    const executeSearch = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
    }
    
    return (
        <div className={style.container}>
            <h2>Manage Users</h2>
        </div>
    );
}

export default UsersAdmin;