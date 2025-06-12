const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Get all invoices for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate('client', 'name email company')
      .populate('project', 'name');
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('client', 'name email company address')
      .populate('project', 'name');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new invoice
router.post('/',
  auth,
  [
    body('client').notEmpty().withMessage('Client is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.description').notEmpty().withMessage('Item description is required'),
    body('items.*.quantity').isNumeric().withMessage('Item quantity must be a number'),
    body('items.*.rate').isNumeric().withMessage('Item rate must be a number')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        client,
        project,
        dueDate,
        items,
        tax,
        currency,
        notes,
        paymentTerms
      } = req.body;

      // Calculate subtotal and total
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const taxAmount = tax ? (subtotal * tax.rate) / 100 : 0;
      const total = subtotal + taxAmount;

      const invoice = new Invoice({
        user: req.user._id,
        client,
        project,
        dueDate,
        items,
        subtotal,
        tax: {
          rate: tax?.rate || 0,
          amount: taxAmount
        },
        total,
        currency,
        notes,
        paymentTerms
      });

      await invoice.save();
      res.status(201).json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update an invoice
router.put('/:id',
  auth,
  [
    body('client').notEmpty().withMessage('Client is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.description').notEmpty().withMessage('Item description is required'),
    body('items.*.quantity').isNumeric().withMessage('Item quantity must be a number'),
    body('items.*.rate').isNumeric().withMessage('Item rate must be a number')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        client,
        project,
        dueDate,
        items,
        tax,
        currency,
        notes,
        paymentTerms,
        status,
        paymentMethod,
        paymentDate
      } = req.body;

      // Calculate subtotal and total
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const taxAmount = tax ? (subtotal * tax.rate) / 100 : 0;
      const total = subtotal + taxAmount;

      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          client,
          project,
          dueDate,
          items,
          subtotal,
          tax: {
            rate: tax?.rate || 0,
            amount: taxAmount
          },
          total,
          currency,
          notes,
          paymentTerms,
          status,
          paymentMethod,
          paymentDate
        },
        { new: true }
      );

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete an invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate PDF for an invoice
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('client', 'name email company address')
      .populate('project', 'name')
      .populate('user', 'name company address');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(25).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.issueDate.toLocaleDateString()}`);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`);
    doc.moveDown();

    // Add client details
    doc.text('Bill To:');
    doc.text(invoice.client.name);
    if (invoice.client.company) doc.text(invoice.client.company);
    doc.text(invoice.client.address.street);
    doc.text(`${invoice.client.address.city}, ${invoice.client.address.state} ${invoice.client.address.zipCode}`);
    doc.text(invoice.client.address.country);
    doc.moveDown();

    // Add items table
    doc.text('Items:', { underline: true });
    doc.moveDown(0.5);

    // Table header
    doc.text('Description', 50, doc.y, { width: 200 });
    doc.text('Quantity', 250, doc.y, { width: 100 });
    doc.text('Rate', 350, doc.y, { width: 100 });
    doc.text('Amount', 450, doc.y, { width: 100 });
    doc.moveDown();

    // Table rows
    invoice.items.forEach(item => {
      doc.text(item.description, 50, doc.y, { width: 200 });
      doc.text(item.quantity.toString(), 250, doc.y, { width: 100 });
      doc.text(item.rate.toString(), 350, doc.y, { width: 100 });
      doc.text((item.quantity * item.rate).toString(), 450, doc.y, { width: 100 });
      doc.moveDown();
    });

    // Add totals
    doc.moveDown();
    doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal.toFixed(2)}`, { align: 'right' });
    if (invoice.tax.rate > 0) {
      doc.text(`Tax (${invoice.tax.rate}%): ${invoice.currency} ${invoice.tax.amount.toFixed(2)}`, { align: 'right' });
    }
    doc.text(`Total: ${invoice.currency} ${invoice.total.toFixed(2)}`, { align: 'right' });

    // Add notes if any
    if (invoice.notes) {
      doc.moveDown(2);
      doc.text('Notes:', { underline: true });
      doc.text(invoice.notes);
    }

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send invoice via email
router.post('/:id/send', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('client', 'name email company')
      .populate('user', 'name email');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: invoice.client.email,
      subject: `Invoice ${invoice.invoiceNumber} from ${invoice.user.name}`,
      text: `Dear ${invoice.client.name},\n\nPlease find attached invoice ${invoice.invoiceNumber}.\n\nTotal Amount: ${invoice.currency} ${invoice.total}\nDue Date: ${invoice.dueDate.toLocaleDateString()}\n\nBest regards,\n${invoice.user.name}`,
      attachments: [{
        filename: `invoice-${invoice.invoiceNumber}.pdf`,
        path: `./invoices/invoice-${invoice.invoiceNumber}.pdf`
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update invoice status
    invoice.status = 'sent';
    await invoice.save();

    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 