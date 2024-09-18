import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Transaction from '@/app/models/Transaction';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const mode = searchParams.get('mode');  // New mode filter

  await dbConnect();

  let query = {};
  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    query.date = { $gte: startDate, $lte: endDate };
  }
  if (type) query.type = type;
  if (category) query.category = category;
  if (mode) query.mode = mode;  // Apply mode filter

  const transactions = await Transaction.find(query).sort({ date: -1 });
  return NextResponse.json(transactions);
}

export async function POST(request) {
  const { description, amount, type, category, mode, date } = await request.json();
  await dbConnect();
  const transaction = await Transaction.create({
    description,
    amount,
    type,
    category,
    mode,
    date: date || Date.now(),  // Save date or use current date if not provided
  });
  return NextResponse.json(transaction, { status: 201 });
}
