"use client";

import { useRouter } from "next/navigation";

type NavigateBackProps = {
	children?: any;
};

const NavigateBack = (props: NavigateBackProps) => {
	const router = useRouter();

	if (props.children) {
		return <>{props.children}</>;
	}

	return (
		<>
			<button
				style={{
					width: "fit-content",
					fontWeight: "700",
					padding: "1rem",
					fontSize: "1rem"
				}}
				onClick={() => router.back()}
			>
				Go Back
			</button>
		</>
	);
};

export default NavigateBack;
