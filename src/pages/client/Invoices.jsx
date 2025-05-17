import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import InvoiceStatusBadge from '../../components/invoices/InvoiceStatusBadge';

const ClientInvoices = () => {
  const { user } = useSelector(state => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const EyeIcon = getIcon('Eye');
  const DownloadIcon = getIcon('Download');
  const ArrowRightIcon = getIcon('ArrowRight');
  const CreditCardIcon = getIcon('CreditCard');
  const BankIcon = getIcon('Building');
  const XIcon = getIcon('X');

  useEffect(() => {
    // Simulate API call to fetch client invoices
    const fetchInvoices = async () => {
      try {
        // In a real app, this would be an API call with the client ID
        setTimeout(() => {
          // Sample data - would come from API in real application
          const mockInvoices = [
            {
              id: 'INV-2023-001',
              issueDate: '2023-09-01',
              dueDate: '2023-09-15',
              status: 'paid',
              total: 2500.00,
              items: [
                { id: 1, description: 'Website Development', quantity: 25, rate: 100, amount: 2500 }
              ],
              payments: [
                { id: 1, date: '2023-09-10', amount: 2500.00, method: 'bank_transfer', reference: 'REF123456' }
              ]
            },
            {
              id: 'INV-2023-002',
              issueDate: '2023-09-05',
              dueDate: '2023-09-19',
              status: 'pending',
              total: 4000.00,
              items: [
                { id: 1, description: 'UI/UX Design', quantity: 20, rate: 120, amount: 2400 },
                { id: 2, description: 'Front-end Development', quantity: 10, rate: 140, amount: 1400 }
              ],
              payments: []
            },
            {
              id: 'INV-2023-003',
              issueDate: '2023-09-10',
              dueDate: '2023-10-10',
              status: 'overdue',
              total: 1200.00,
              items: [
                { id: 1, description: 'Content Writing', quantity: 8, rate: 150, amount: 1200 }
              ],
              payments: []
            }
          ];
          setInvoices(mockInvoices);
          setLoading(false);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user?.id]);

  const handleViewInvoice = (invoice) => {
    setActiveInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    // In a real app, this would download the invoice PDF
    toast.info(`Downloading invoice ${invoice.id}...`);
    setTimeout(() => {
      toast.success(`Invoice ${invoice.id} downloaded successfully`);
    }, 1500);
  };

  const initiatePayment = (invoice) => {
    setActiveInvoice(invoice);
    setShowPaymentModal(true);
  };

  const processPayment = (method) => {
    // In a real app, this would process the payment
    toast.info('Processing payment...');
    setTimeout(() => {
      toast.success('Payment processed successfully!');
      
      // Update the invoice status locally
      setInvoices(invoices.map(inv => 
        inv.id === activeInvoice.id 
          ? {...inv, status: 'paid', payments: [
              ...inv.payments, 
              { id: Date.now(), date: format(new Date(), 'yyyy-MM-dd'), amount: inv.total, method, reference: `PAY-${Date.now()}` }
            ]} 
          : inv
      ));
      
      setShowPaymentModal(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Invoices</h1>
      
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-surface-600 dark:text-surface-400">You don't have any invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-100 dark:bg-surface-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(parseISO(invoice.issueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(parseISO(invoice.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      ${invoice.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-1 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white"
                        title="View Invoice"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-1 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white"
                        title="Download Invoice"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                      {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                        <button 
                          onClick={() => initiatePayment(invoice)}
                          className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                        >
                          Pay Now
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {activeInvoice && !showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Invoice {activeInvoice.id}</h3>
              <button 
                onClick={() => setActiveInvoice(null)}
                className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Issue Date</p>
                  <p className="font-medium">{format(parseISO(activeInvoice.issueDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Due Date</p>
                  <p className="font-medium">{format(parseISO(activeInvoice.dueDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Status</p>
                  <InvoiceStatusBadge status={activeInvoice.status} />
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
                    {activeInvoice.items.map((item, index) => (
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
              
              <div className="mt-6 flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${parseFloat(activeInvoice.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {activeInvoice.payments && activeInvoice.payments.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Payment History</h4>
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
                        {activeInvoice.payments.map((payment, index) => (
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
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => handleDownloadInvoice(activeInvoice)}
                className="btn-outline"
              >
                <DownloadIcon className="w-4 h-4 mr-2" /> Download PDF
              </button>
              
              {(activeInvoice.status === 'pending' || activeInvoice.status === 'overdue') && (
                <button 
                  onClick={() => {
                    setShowPaymentModal(true);
                  }}
                  className="btn-primary"
                >
                  Pay Now <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && activeInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Invoice: <span className="font-medium">{activeInvoice.id}</span></p>
              <p className="mb-4">Amount Due: <span className="font-medium">${parseFloat(activeInvoice.total).toFixed(2)}</span></p>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Select Payment Method</h4>
                
                <button 
                  onClick={() => processPayment('credit_card')}
                  className="w-full py-4 px-4 border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center"
                >
                  <CreditCardIcon className="w-6 h-6 mr-3 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Pay securely with Visa, Mastercard, or Amex</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => processPayment('bank_transfer')}
                  className="w-full py-4 px-4 border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center"
                >
                  <BankIcon className="w-6 h-6 mr-3 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Pay directly from your bank account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ClientInvoices;