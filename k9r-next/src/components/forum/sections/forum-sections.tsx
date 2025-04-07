"use client";

import { useEffect, useState } from "react";
import style from "./sections.module.scss";
import { ForumSection } from "@/api/forum/models";
import { getAllForumSections } from "@/api/forum/api";
import LoadingAlert from "@/components/loading/loading-alert";
import Section from "./forum-section";

const ForumSections = () => {
    const [sections, setSections] = useState<ForumSection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            const all_sections = await getAllForumSections();
            setSections(all_sections);
            setLoading(false);
        })();
    }, []);

    return (
        <div className={`${style.forum_sections} flex col gap-1 flex-1`}>
            {loading ? (
                <div className={`${style.forum_section} flex col gap-1`}>
                    <LoadingAlert message="Loading sections..." />
                </div>
            ) : (
                <>
                    {sections.sort((a, b) => a.sort_order <= b.sort_order ? 1 : -1).map((section, index) => {
                        return (
                            <Section key={index} forum_section={section} />
                        )
                    })}
                    {sections.length <= 0 && (
                        <div className={`${style.forum_section} flex col gap-1`}>
                            <span>No forum sections exist!</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ForumSections;