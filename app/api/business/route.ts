import { businessValidatorSchema } from '@/validator/business.validator';
import { NextResponse } from 'next/server';
import db from '@/db/index';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = businessValidatorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }
    const newBusiness = await db.business.create(body);
    return NextResponse.json(newBusiness, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
