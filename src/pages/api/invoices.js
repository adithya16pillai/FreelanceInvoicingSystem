import dbConnect from '../../lib/db';
import Invoice from '../../models/Invoice';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const invoices = await Invoice.find({});
    return res.status(200).json(invoices);
  }

  if (req.method === 'POST') {
    const invoice = new Invoice(req.body);
    await invoice.save();
    return res.status(201).json(invoice);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 