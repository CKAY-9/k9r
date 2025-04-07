import { useEffect, useState } from "react";
import style from "./status.module.scss";

type SupportTicketStatusProps = {
    support_ticket_status: number
};

const SupportTicketStatus = (props: SupportTicketStatusProps) => {
    const [bg_color, setBGColor] = useState<string>("rgb(30, 30, 30)");

    useEffect(() => {
        switch (props.support_ticket_status) {
            case 0:
                setBGColor("rgb(255, 255, 0)");
                break;
            case 1:
                setBGColor("rgb(255, 255, 255)");
                break;
            case 2:
                setBGColor("rgb(150, 150, 150)");
                break;
        }
    }, [props.support_ticket_status]);

    return (
        <div className={style.status_container}>
            <div className={style.status} style={{backgroundColor: bg_color}}></div>
            <span>
                {props.support_ticket_status === 0 && "Open"}
                {props.support_ticket_status === 1 && "In Progress"}
                {props.support_ticket_status === 2 && "Closed"}
            </span>
        </div>
    )
}

export default SupportTicketStatus;