import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import InvoiceStatusBadge from '../../components/invoices/InvoiceStatusBadge';
import { fetchInvoices, deleteInvoice } from '../../store/slices/invoiceSlice';

const InvoicesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading } = useSelector(state => state.invoices);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('issueDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const EyeIcon = getIcon('Eye');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const ChevronUpIcon = getIcon('ChevronUp');
  const ChevronDownIcon = getIcon('ChevronDown');

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const confirmDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (invoiceToDelete) {
      try {
        await dispatch(deleteInvoice(invoiceToDelete.id)).unwrap();
        toast.success('Invoice deleted successfully');
      } catch (error) {
        toast.error('Failed to delete invoice');
      } finally {
        setShowDeleteConfirm(false);
        setInvoiceToDelete(null);
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 inline-block ml-1" /> : 
      <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />;
  };

  // Filter and sort invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesClient = clientFilter === 'all' || invoice.clientId.toString() === clientFilter;
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesClient && matchesSearch;
  }).sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
    } else if (sortField === 'dueDate' || sortField === 'issueDate') {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valueA = a[sortField]?.toLowerCase() || '';
      const valueB = b[sortField]?.toLowerCase() || '';
      return sortDirection === 'asc' ? 
        valueA.localeCompare(valueB) : 
        valueB.localeCompare(valueA);
    }
  });

  // Extract unique clients for filter dropdown
  const clients = [...new Map(invoices.map(inv => [inv.clientId, { id: inv.clientId, name: inv.clientName }])).values()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link to="/invoices/new" className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" /> Create Invoice
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="w-full md:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="w-full md:w-48"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="all">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                <th onClick={() => handleSort('id')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Invoice # {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('clientName')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Client {getSortIcon('clientName')}
                </th>
                <th onClick={() => handleSort('issueDate')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Issue Date {getSortIcon('issueDate')}
                </th>
                <th onClick={() => handleSort('dueDate')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Due Date {getSortIcon('dueDate')}
                </th>
                <th onClick={() => handleSort('total')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Amount {getSortIcon('total')}
                </th>
                <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer">
                  Status {getSortIcon('status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(parseISO(invoice.issueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(parseISO(invoice.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${invoice.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-1">
                      <button 
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                        className="p-1 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white"
                        title="View Invoice"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                        className="p-1 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white"
                        title="Edit Invoice"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(invoice)}
                        className="p-1 text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400"
                        title="Delete Invoice"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-surface-500 dark:text-surface-400">
                    <p className="mt-2 text-surface-500 dark:text-surface-400">
                      {searchTerm || statusFilter !== 'all' || clientFilter !== 'all' ? 
                        "No invoices found matching your filters. Try adjusting your search criteria." : 
                        "No invoices found. Click 'Create Invoice' to create your first invoice."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete invoice <span className="font-medium">{invoiceToDelete?.id}</span>? This action cannot be undone.</p>
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
    </motion.div>
  );
};

export default InvoicesPage;