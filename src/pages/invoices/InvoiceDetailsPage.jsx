import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import InvoiceStatusBadge from '../../components/invoices/InvoiceStatusBadge';
import { fetchInvoiceById, deleteInvoice, updateInvoice } from '../../store/slices/invoiceSlice';

const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentInvoice: invoice, loading } = useSelector(state => state.invoices);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const MailIcon = getIcon('Mail');
  const DownloadIcon = getIcon('Download');
  const CheckIcon = getIcon('Check');
  const PrinterIcon = getIcon('Printer');

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (invoice && invoice.clientName) {
      setEmailData({
        to: `client@example.com`, // In a real app, this would come from the client data
        subject: `Invoice ${invoice.id} from FreeLink`,
        message: `Dear ${invoice.clientName},\n\nPlease find attached invoice ${invoice.id} for $${invoice.total}.\n\nPayment is due on ${format(parseISO(invoice.dueDate), 'MMMM d, yyyy')}.\n\nThank you for your business.\n\nBest regards,\nFreeLink`
      });
    }
  }, [invoice]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteInvoice(id)).unwrap();
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      toast.error('Failed to delete invoice');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleSend = () => {
    // In a real app, this would call an API to send the email
    toast.success('Invoice sent successfully');
    setShowSendModal(false);
  };

  const handleMarkAsPaid = async () => {
    if (invoice && invoice.status !== 'paid') {
      try {
        await dispatch(updateInvoice({
          id: invoice.id,
          data: { ...invoice, status: 'paid', payments: [
            ...invoice.payments,
            { id: Date.now(), date: format(new Date(), 'yyyy-MM-dd'), amount: invoice.total, method: 'manual', reference: 'Marked as paid manually' }
          ]}
        })).unwrap();
        toast.success('Invoice marked as paid');
      } catch (error) {
        toast.error('Failed to update invoice status');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
        <p className="mb-4">The invoice you are looking for could not be found.</p>
        <button onClick={() => navigate('/invoices')} className="btn-primary">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/invoices')} 
            className="p-2 mr-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate(`/invoices/${id}/edit`)} 
            className="btn-outline"
          >
            <EditIcon className="w-4 h-4 mr-2" /> Edit
          </button>
          <button 
            onClick={() => setShowSendModal(true)} 
            className="btn-outline"
          >
            <MailIcon className="w-4 h-4 mr-2" /> Send
          </button>
          {invoice.status !== 'paid' && (
            <button 
              onClick={handleMarkAsPaid} 
              className="btn bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckIcon className="w-4 h-4 mr-2" /> Mark as Paid
            </button>
          )}
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="btn bg-red-500 hover:bg-red-600 text-white"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Invoice To:</h2>
            <div className="mt-2">
              <p className="font-medium">{invoice.clientName}</p>
              <p className="text-surface-600 dark:text-surface-400">Client ID: {invoice.clientId}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <div className="flex flex-col items-end">
              <InvoiceStatusBadge status={invoice.status} />
              <div className="mt-2">
                <p><span className="text-surface-600 dark:text-surface-400">Issue Date:</span> {format(parseISO(invoice.issueDate), 'MMMM d, yyyy')}</p>
                <p><span className="text-surface-600 dark:text-surface-400">Due Date:</span> {format(parseISO(invoice.dueDate), 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    ${parseFloat(item.rate).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right">
                    ${parseFloat(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between">
              <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
              <span className="font-medium">${parseFloat(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600 dark:text-surface-400">Tax:</span>
              <span className="font-medium">${parseFloat(invoice.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-surface-200 dark:border-surface-700">
              <span>Total:</span>
              <span>${parseFloat(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 p-4 bg-surface-50 dark:bg-surface-700/30 rounded-lg">
            <h3 className="font-medium mb-2">Notes</h3>
            <p className="text-surface-600 dark:text-surface-400 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-100 dark:bg-surface-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
                  {invoice.payments.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm">
                        {format(parseISO(payment.date), 'MMMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {payment.method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button className="btn-outline" onClick={() => window.print()}>
            <PrinterIcon className="w-4 h-4 mr-2" /> Print
          </button>
          <button className="btn-outline">
            <DownloadIcon className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete invoice <span className="font-medium">{invoice.id}</span>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="btn-outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn bg-red-500 hover:bg-red-600 text-white" 
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Send Invoice</h3>
            <div className="space-y-4">
              <div className="input-group">
                <label htmlFor="email" className="input-label">Recipient Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full"
                  value={emailData.to}
                  onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label htmlFor="subject" className="input-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label htmlFor="message" className="input-label">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full"
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn-outline" 
                onClick={() => setShowSendModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSend}
              >
                <MailIcon className="w-4 h-4 mr-2" /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InvoiceDetailsPage;