import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../../utils/iconUtils';
import ClientForm from '../../components/clients/ClientForm';
import { getClients, deleteClient } from '../../services/clientService';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const UserIcon = getIcon('User');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const TagIcon = getIcon('Tag');
  const ClockIcon = getIcon('Clock');
  const XIcon = getIcon('X');
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  useEffect(() => {
    filterClients();
  }, [searchTerm, statusFilter, clients]);
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      toast.error('Failed to load clients');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterClients = () => {
    let filtered = [...clients];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    setFilteredClients(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleAddClient = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };
  
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (client) => {
    setDeleteConfirmation(client);
  };
  
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;
    
    try {
      await deleteClient(deleteConfirmation.id);
      setClients(clients.filter(c => c.id !== deleteConfirmation.id));
      toast.success(`${deleteConfirmation.name} has been removed`);
    } catch (error) {
      toast.error('Failed to delete client');
      console.error(error);
    } finally {
      setDeleteConfirmation(null);
    }
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedClient(null);
  };
  
  const handleFormSubmit = (client, isNew) => {
    if (isNew) {
      setClients([...clients, client]);
    } else {
      setClients(clients.map(c => c.id === client.id ? client : c));
    }
    setIsFormOpen(false);
    toast.success(isNew ? 'Client added successfully' : 'Client updated successfully');
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'badge-green';
      case 'inactive':
        return 'badge-yellow';
      case 'lead':
        return 'badge-blue';
      default:
        return 'badge-blue';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={handleAddClient}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-12 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-surface-400" />
            <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-surface-100">No clients found</h3>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                : 'Get started by adding your first client.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-100 dark:bg-surface-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-600 dark:text-surface-300">Added On</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-surface-600 dark:text-surface-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                    <td className="px-4 py-4 whitespace-nowrap">{client.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.company || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(client.status)}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {format(new Date(client.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-primary hover:text-primary-dark p-1"
                        aria-label="Edit client"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client)}
                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                        aria-label="Delete client"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {isFormOpen && (
        <ClientForm
          client={selectedClient}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
      
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-surface-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Delete Client</h2>
            <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button className="btn-outline" onClick={() => setDeleteConfirmation(null)}>Cancel</button>
              <button className="btn bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;