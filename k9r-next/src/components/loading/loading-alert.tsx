"use client";

type LoadingAlertProps = {
    message?: string
};

const LoadingAlert = (props: LoadingAlertProps) => {
    return (
        <>
            <span>{props.message ? props.message : ""}</span>
        </>
    )
}

export default LoadingAlert;