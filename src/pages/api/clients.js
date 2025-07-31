import dbConnect from '../../lib/db';
import Invoice from '../../models/Invoice';

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'GET') {
      // Get unique clients from invoices
      const invoices = await Invoice.find({});
      const clients = [...new Set(invoices.map(inv => inv.client.name))];
      return res.status(200).json(clients);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 