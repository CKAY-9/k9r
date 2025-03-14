export type User = {
    id: number;
    token: string;
    username: string;
    display_name: string;
    description: string;
    joined: string;
    oauth_type: string;
    followers: number[];
    following: number[];
    usergroups: number[];
    reputation: number;
    avatar: string;
    banner: string;
};