"use client";

import { K9R_API } from "@/api/resources";
import { uploadFile } from "@/api/storage/api";
import { getCookie } from "@/utils/cookies";
import Image from "next/image";
import { BaseSyntheticEvent, useState } from "react";
import style from "./upload.module.scss";

type ImageUploadProps = {
	default_image_url?: string;
	on_upload?: any;
	width?: number;
	height?: number;
};

const ImageUpload = (props: ImageUploadProps) => {
	const [image_url, setImageUrl] = useState<string | null>(
		props.default_image_url || null
	);
	const [is_uploading, setIsUploading] = useState<boolean>(false);

	const handleUpload = async (e: BaseSyntheticEvent) => {
		const file = e.target.files[0];
		if (!file) return;

		setIsUploading(true);
		const form_data = new FormData();
		form_data.append("file", file);

		try {
			const response = await uploadFile(
				form_data,
				getCookie("token") || ""
			);

			if (response !== null) {
				setImageUrl(`${K9R_API}/storage${response.url}`);
				if (props.on_upload) {
					props.on_upload(`${K9R_API}/storage${response.url}`);
				}
			}
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className={style.container}>
			{image_url && (
				<div>
					<Image
						src={image_url}
						style={{"objectFit": "cover"}}
						alt="Uploaded preview"
						onError={(e: BaseSyntheticEvent) => {
							e.target.src = "/icon.png";
						}}
						width={props.width || 128}
						height={props.height || 128}
					/>
				</div>
			)}
			<input
				type="file"
				id="image-upload"
				accept="image/*"
				onChange={handleUpload}
				disabled={is_uploading}
				style={{ width: "fit-content" }}
			/>

			<label>{is_uploading && "Uploading..."}</label>
		</div>
	);
};

export default ImageUpload;
