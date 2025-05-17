import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ clients, setClients }) => {
  // States for client management
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  // Form states
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'prospect',
    tags: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Get icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortAscIcon = getIcon('ArrowUpDown');
  const PlusIcon = getIcon('Plus');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  const TagIcon = getIcon('Tag');
  const UserIcon = getIcon('User');
  const BuildingIcon = getIcon('Building');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  
  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      // Apply status filter
      if (filter !== 'all' && client.status !== filter) {
        return false;
      }
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          client.name.toLowerCase().includes(query) ||
          client.company.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          (client.tags && client.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (sortBy === 'company') {
        return sortDirection === 'asc'
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
      
      if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      
      if (sortBy === 'lastInteraction') {
        const dateA = a.lastInteraction ? new Date(a.lastInteraction) : new Date(0);
        const dateB = b.lastInteraction ? new Date(b.lastInteraction) : new Date(0);
        
        return sortDirection === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      
      return 0;
    });
  
  const handleToggleSort = (field) => {
    if (sortBy === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const openAddModal = () => {
    setNewClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'prospect',
      tags: ''
    });
    setErrors({});
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  const openEditModal = (client) => {
    setEditingClient(client);
    setNewClient({
      ...client,
      tags: client.tags ? client.tags.join(', ') : ''
    });
    setErrors({});
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingClient(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!newClient.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newClient.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(newClient.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!newClient.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddClient = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const newClientData = {
      ...newClient,
      id: Date.now().toString(),
      tags: newClient.tags ? newClient.tags.split(',').map(tag => tag.trim()) : [],
      lastInteraction: new Date().toISOString()
    };
    
    setClients(prev => [...prev, newClientData]);
    toast.success('Client added successfully!');
    closeAddModal();
  };
  
  const handleUpdateClient = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updatedClientData = {
      ...editingClient,
      ...newClient,
      tags: newClient.tags ? newClient.tags.split(',').map(tag => tag.trim()) : []
    };
    
    setClients(prev => 
      prev.map(client => 
        client.id === editingClient.id ? updatedClientData : client
      )
    );
    
    toast.success('Client updated successfully!');
    closeEditModal();
  };
  
  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client deleted successfully!');
    }
  };
  
  // Status badge color mapping
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    prospect: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
  };
  
  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Client Management</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your client relationships in one place
          </p>
        </div>
        <div className="flex mt-4 md:mt-0">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
            onClick={openAddModal}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Client</span>
          </motion.button>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64 md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-4 h-4 text-surface-500" />
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <FilterIcon className="w-4 h-4 text-surface-500" />
              <select
                className="bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th 
                  className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100 cursor-pointer"
                  onClick={() => handleToggleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Client Name</span>
                    {sortBy === 'name' && (
                      <SortAscIcon className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100 cursor-pointer"
                  onClick={() => handleToggleSort('company')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Company</span>
                    {sortBy === 'company' && (
                      <SortAscIcon className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                  Contact
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100 cursor-pointer"
                  onClick={() => handleToggleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortBy === 'status' && (
                      <SortAscIcon className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                  Tags
                </th>
                <th className="text-right py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-surface-500 dark:text-surface-400">
                    {searchQuery || filter !== 'all' 
                      ? "No clients match your search criteria" 
                      : "You haven't added any clients yet"}
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium">{client.name}</div>
                    </td>
                    <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                      {client.company}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <a href={`mailto:${client.email}`} className="text-primary hover:underline truncate max-w-[180px]">
                          {client.email}
                        </a>
                        <span className="text-surface-600 dark:text-surface-400 text-sm">
                          {client.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {client.tags && client.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(client)}
                          className="p-1.5 rounded-lg text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                          aria-label="Edit client"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1.5 rounded-lg text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                          aria-label="Delete client"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={closeAddModal}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="sticky top-0 bg-white dark:bg-surface-800 p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-xl font-bold">Add New Client</h3>
                <button 
                  onClick={closeAddModal}
                  className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddClient} className="p-5 space-y-4">
                <div className="input-group">
                  <label htmlFor="name" className="input-label flex items-center space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span>Client Name*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter client's full name"
                    className={`w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="company" className="input-label flex items-center space-x-1">
                    <BuildingIcon className="w-4 h-4" />
                    <span>Company</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Enter company name"
                    className="w-full"
                    value={newClient.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="email" className="input-label flex items-center space-x-1">
                    <MailIcon className="w-4 h-4" />
                    <span>Email Address*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    className={`w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="phone" className="input-label flex items-center space-x-1">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Phone Number*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    className={`w-full ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="status" className="input-label">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="w-full"
                    value={newClient.status}
                    onChange={handleInputChange}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="tags" className="input-label flex items-center space-x-1">
                    <TagIcon className="w-4 h-4" />
                    <span>Tags</span>
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="Enter tags separated by commas (e.g. design, website, marketing)"
                    className="w-full"
                    value={newClient.tags}
                    onChange={handleInputChange}
                  />
                  <p className="form-help">Separate tags with commas</p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="btn-outline w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-1/2"
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Edit Client Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={closeEditModal}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="sticky top-0 bg-white dark:bg-surface-800 p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-xl font-bold">Edit Client</h3>
                <button 
                  onClick={closeEditModal}
                  className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateClient} className="p-5 space-y-4">
                <div className="input-group">
                  <label htmlFor="edit-name" className="input-label flex items-center space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span>Client Name*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    placeholder="Enter client's full name"
                    className={`w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="edit-company" className="input-label flex items-center space-x-1">
                    <BuildingIcon className="w-4 h-4" />
                    <span>Company</span>
                  </label>
                  <input
                    type="text"
                    id="edit-company"
                    name="company"
                    placeholder="Enter company name"
                    className="w-full"
                    value={newClient.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="edit-email" className="input-label flex items-center space-x-1">
                    <MailIcon className="w-4 h-4" />
                    <span>Email Address*</span>
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    placeholder="Enter email address"
                    className={`w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="edit-phone" className="input-label flex items-center space-x-1">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Phone Number*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-phone"
                    name="phone"
                    placeholder="Enter phone number"
                    className={`w-full ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={newClient.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="edit-status" className="input-label">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    className="w-full"
                    value={newClient.status}
                    onChange={handleInputChange}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="edit-tags" className="input-label flex items-center space-x-1">
                    <TagIcon className="w-4 h-4" />
                    <span>Tags</span>
                  </label>
                  <input
                    type="text"
                    id="edit-tags"
                    name="tags"
                    placeholder="Enter tags separated by commas (e.g. design, website, marketing)"
                    className="w-full"
                    value={newClient.tags}
                    onChange={handleInputChange}
                  />
                  <p className="form-help">Separate tags with commas</p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="btn-outline w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-1/2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainFeature;