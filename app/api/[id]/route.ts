import { NextResponse } from "next/server";

type ResponseData = {
	message: string;
};

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData>> {
	const { id } = await params;
	return NextResponse.json({
		message: `The API is running (id: ${id})`,
	});
}
