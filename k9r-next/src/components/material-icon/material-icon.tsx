import Image from "next/image";
import style from "./icon.module.scss";

type MaterialIconProps = {
    src: string;
    alt?: string;
    size_rems?: number;
}

const MaterialIcon = (props: MaterialIconProps) => {
    return (
        <>
            <Image 
                src={props.src === "" ? null : props.src}
                alt={props.alt ? props.alt : `Material Icon (${props.src})`}
                sizes="100%"
                width={0}
                height={0}
                className={style.material_icon}
                style={{
                    "width": props.size_rems ? `${props.size_rems}rem !important` : "2rem",
                    "height": props.size_rems ? `${props.size_rems}rem !important` : "2rem"
                }}
            />
        </>
    );
}

export default MaterialIcon;