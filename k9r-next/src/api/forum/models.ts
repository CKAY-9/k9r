export type ForumSection = {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    topics: number[];
    sort_order: number;
};

export type ForumTopic = {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    section: number;
    threads: number[];
};

export type ForumThread = {
    id: number;
    title: string;
    author: number;
    created: string;
    updated: string;
    likes: number[];
    dislikes: number[];
    primary_post: number;
    posts: number[];
    topic: number;
    locked: boolean;
    sticky: boolean;
    template: boolean;
};

export type ForumPost = {
    id: number;
    author: number;
    content: string;
    json_content: string;
    created: string;
    updated: string;
    likes: number[];
    dislikes: number[];
    thread: number;
    template: boolean;
};
