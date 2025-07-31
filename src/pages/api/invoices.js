import dbConnect from '../../lib/db';
import Invoice from '../../models/Invoice';

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        const { id } = req.query;
        if (id) {
          const invoice = await Invoice.findById(id);
          if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
          }
          return res.status(200).json(invoice);
        }
        const invoices = await Invoice.find({}).sort({ createdAt: -1 });
        return res.status(200).json(invoices);

      case 'POST':
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        return res.status(201).json(newInvoice);

      case 'PUT':
        const { id: updateId } = req.query;
        if (!updateId) {
          return res.status(400).json({ error: 'Invoice ID is required' });
        }
        const updatedInvoice = await Invoice.findByIdAndUpdate(
          updateId,
          req.body,
          { new: true, runValidators: true }
        );
        if (!updatedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.status(200).json(updatedInvoice);

      case 'DELETE':
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: 'Invoice ID is required' });
        }
        const deletedInvoice = await Invoice.findByIdAndDelete(deleteId);
        if (!deletedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.status(200).json({ message: 'Invoice deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 