"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	useEffect(() => {
		router.push("/chats/new");
	}, [router]);
	return <div>Loading...</div>;
}
