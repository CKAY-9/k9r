import MaterialIcon from "@/components/material-icon/material-icon";
import Link from "next/link";

type ReportUserLinkProps = {
    user_id: number
};

const ReportUserLink = (props: ReportUserLinkProps) => {
    return (
        <>
            <Link href={`/support?tab=newticket&report_user=${props.user_id}`}>
                <MaterialIcon 
                    src="/icons/report.svg"
                    alt="Report User"
                    size_rems={2}
                />
            </Link>
        </>
    );
}

export default ReportUserLink;