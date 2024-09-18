import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Transaction from '@/app/models/Transaction';

export async function PUT(request, { params }) {
  const { id } = params;
  const { description, amount, type, category, mode, date } = await request.json();
  await dbConnect();
  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { description, amount, type, category, mode, date: date || Date.now() },  // Update date
    { new: true }
  );
  return NextResponse.json(transaction);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await dbConnect();
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Transaction deleted' }, { status: 200 });
}
