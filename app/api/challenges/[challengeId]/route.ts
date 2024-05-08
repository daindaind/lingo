import db from '@/db/drizzle';
import { challenges } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = async (
	req: Request,
	{ params }: { params: { unitId: number } },
) => {
	// middleware에서 한번에 처리 가능
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 });
	}

	const data = await db.query.challenges.findFirst({
		where: eq(challenges.id, params.unitId),
	});

	return NextResponse.json(data);
};

export const PUT = async (
	req: Request,
	{ params }: { params: { unitId: number } },
) => {
	// middleware에서 한번에 처리 가능
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 });
	}

	const body = await req.json();
	const data = await db
		.update(challenges)
		.set({
			...body,
		})
		.where(eq(challenges.id, params.unitId))
		.returning();

	return NextResponse.json(data[0]);
};

export const DELETE = async (
	req: Request,
	{ params }: { params: { unitId: number } },
) => {
	// middleware에서 한번에 처리 가능
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 });
	}

	const data = await db
		.delete(challenges)
		.where(eq(challenges.id, params.unitId))
		.returning();

	return NextResponse.json(data[0]);
};
