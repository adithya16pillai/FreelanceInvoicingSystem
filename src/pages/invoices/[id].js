import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Edit, Download, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function InvoiceView() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        toast.error('Invoice not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          ...(newStatus === 'paid' && { paidDate: new Date() })
        }),
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        setInvoice(updatedInvoice);
        toast.success(`Invoice marked as ${newStatus}`);
      } else {
        throw new Error('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice?.currency || 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'sent':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'draft':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                href="/"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
                <p className="text-gray-600">Created on {formatDate(invoice.issueDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(invoice.status)}
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <Link
                href={`/invoices/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invoice Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Invoice Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{invoice.freelancer.name}</h2>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{invoice.freelancer.address}</p>
                  <p>{invoice.freelancer.email}</p>
                  {invoice.freelancer.phone && <p>{invoice.freelancer.phone}</p>}
                  {invoice.freelancer.website && <p>{invoice.freelancer.website}</p>}
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>Issue Date:</strong> {formatDate(invoice.issueDate)}</p>
                  <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
                  <p><strong>Payment Terms:</strong> {invoice.paymentTerms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bill To:</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{invoice.client.name}</p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.email}</p>
              {invoice.client.phone && <p>{invoice.client.phone}</p>}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="px-8 py-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Quantity
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Rate
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="py-4 text-sm text-gray-900 text-right">{formatCurrency(item.rate)}</td>
                    <td className="py-4 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 py-6 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="text-sm font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 py-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Thank you for your business!</p>
              </div>
              <div className="flex space-x-4">
                {invoice.status === 'draft' && (
                  <button
                    onClick={() => updateStatus('sent')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail size={16} className="mr-2" />
                    Mark as Sent
                  </button>
                )}
                {invoice.status === 'sent' && (
                  <button
                    onClick={() => updateStatus('paid')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Paid
                  </button>
                )}
                {invoice.status === 'overdue' && (
                  <button
                    onClick={() => updateStatus('paid')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 