import Chat from "@/app/ui/chat";

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;
	return <Chat id={id} />;
}
