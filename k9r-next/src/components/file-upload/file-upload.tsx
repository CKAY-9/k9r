"use client";

import { K9R_API } from "@/api/resources";
import { deleteFile, uploadFile } from "@/api/storage/api";
import { BaseSyntheticEvent, useState } from "react";
import style from "./upload.module.scss";
import { getAnyToken } from "@/utils/token";

type FileUploadProps = {
	on_upload?: any;
	on_remove?: any;
};

const FileUpload = (props: FileUploadProps) => {
	const [file_url, setFileURL] = useState<string | null>(
		null
	);
	const [is_uploading, setIsUploading] = useState<boolean>(false);

	const handleUpload = async (e: BaseSyntheticEvent) => {
		const file = e.target.files[0];
		if (!file) return;

		setIsUploading(true);
		const form_data = new FormData();
		form_data.append("file", file);

		try {
			const response = await uploadFile(form_data, await getAnyToken());

			if (response !== null) {
				setFileURL(`${K9R_API}/storage${response.url}`);
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

	const handleDelete = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (!file_url) return;

		const url_split = file_url.split("files/")[1];
		if (!url_split) return;

		const response = await deleteFile(url_split, await getAnyToken());

		if (response) {
			setFileURL(null);
			if (props.on_remove) {
				props.on_remove();
			}
		}
	};

	return (
		<div className={style.container}>
			{file_url && (
				<>
					{props.on_remove && (
						<button onClick={handleDelete}>Remove File</button>
					)}
					<div>

					</div>
				</>
			)}
			<input
				type="file"
				id="file-upload"
				accept="*"
				onChange={handleUpload}
				disabled={is_uploading}
				style={{ width: "fit-content" }}
			/>

			<label>{is_uploading && "Uploading..."}</label>
		</div>
	);
};

export default FileUpload;
