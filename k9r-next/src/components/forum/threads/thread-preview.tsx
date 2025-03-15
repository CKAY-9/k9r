import { ForumThread } from "@/api/forum/models";
import style from "./threads.module.scss";

type ThreadPreviewProps = {
    forum_thread: ForumThread;
};

const ThreadPreview = (props: ThreadPreviewProps) => {
    return (
        <div className={style.thread_preview}>
            <h4>{props.forum_thread.title}</h4>
        </div>
    );
}

export default ThreadPreview;