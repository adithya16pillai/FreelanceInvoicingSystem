import dbConnect from '../../../lib/db';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        const invoice = await Invoice.findById(id);
        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.status(200).json(invoice);

      case 'PUT':
        const updatedInvoice = await Invoice.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
        );
        if (!updatedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.status(200).json(updatedInvoice);

      case 'DELETE':
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.status(200).json({ message: 'Invoice deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 