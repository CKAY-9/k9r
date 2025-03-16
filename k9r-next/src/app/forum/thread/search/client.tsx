"use client";

import SearchBar from "@/components/search-bar/search-bar";
import style from "./search.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import Link from "next/link";
import { ForumThread } from "@/api/forum/models";
import ThreadPreview from "@/components/forum/threads/thread-preview";
import { searchThreads } from "@/api/forum/api";

const SearchThreadsClient = () => {
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [thread_results, setThreadResults] = useState<ForumThread[]>([]);

    const searchPosts = async (e?: BaseSyntheticEvent) => {
        if (e) {
            e.preventDefault();
        }

        const ts = await searchThreads(search, page);
        setThreadResults(ts);
    }

    return (
        <>
            <div className={style.content}>
                <h1>Search Threads</h1>
                <SearchBar search={searchPosts} set_search={setSearch} placeholder="Search threads by ID, title" />
            </div>
            <div className={style.content}>
                <h2>Results</h2>
                {thread_results.map((thread, index) => {
                    return (
                        <Link href={`/forum/topic/${thread.topic}/${thread.id}`} key={index} className={style.user}>
                            <ThreadPreview forum_thread={thread} />
                        </Link>
                    );
                })}
                {thread_results.length <= 0 && (
                    <span>No results found.</span>
                )}
            </div>
        </>
    );
}

export default SearchThreadsClient;