import axios from 'axios';

// Base URL would come from environment config in a real application
const API_URL = 'https://api.example.com/invoices';

// Mock data for development - would be replaced by actual API calls
const mockInvoices = [
  {
    id: 'INV-2023-001',
    clientId: 1,
    clientName: 'Acme Corporation',
    issueDate: '2023-09-01',
    dueDate: '2023-09-15',
    status: 'paid',
    total: 2500.00,
    subtotal: 2500.00,
    tax: 0,
    items: [
      { id: 1, description: 'Website Development', quantity: 25, rate: 100, amount: 2500 }
    ],
    payments: [
      { id: 1, date: '2023-09-10', amount: 2500.00, method: 'bank_transfer', reference: 'REF123456' }
    ],
    notes: 'Thank you for your business!'
  },
  {
    id: 'INV-2023-002',
    clientId: 2,
    clientName: 'Tech Solutions Inc',
    issueDate: '2023-09-05',
    dueDate: '2023-09-19',
    status: 'pending',
    total: 4000.00,
    subtotal: 3800.00,
    tax: 200.00,
    items: [
      { id: 1, description: 'UI/UX Design', quantity: 20, rate: 120, amount: 2400 },
      { id: 2, description: 'Front-end Development', quantity: 10, rate: 140, amount: 1400 }
    ],
    payments: [],
    notes: 'Net 14 payment terms'
  },
  {
    id: 'INV-2023-003',
    clientId: 3,
    clientName: 'Global Media Group',
    issueDate: '2023-09-10',
    dueDate: '2023-10-10',
    status: 'overdue',
    total: 1200.00,
    subtotal: 1200.00,
    tax: 0,
    items: [
      { id: 1, description: 'Content Writing', quantity: 8, rate: 150, amount: 1200 }
    ],
    payments: [],
    notes: 'Please remit payment within terms'
  },
  {
    id: 'INV-2023-004',
    clientId: 1,
    clientName: 'Acme Corporation',
    issueDate: '2023-09-20',
    dueDate: '2023-10-04',
    status: 'draft',
    total: 3000.00,
    subtotal: 3000.00,
    tax: 0,
    items: [
      { id: 1, description: 'Maintenance Services', quantity: 10, rate: 150, amount: 1500 },
      { id: 2, description: 'Feature Development', quantity: 10, rate: 150, amount: 1500 }
    ],
    payments: [],
    notes: 'Draft invoice - do not send yet'
  }
];

// Get all invoices
export const getInvoices = async () => {
  try {
    // For demo purposes, return mock data instead of making an actual API call
    // In production: const response = await axios.get(API_URL);
    return { data: mockInvoices };
  } catch (error) {
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  try {
    // In production: const response = await axios.get(`${API_URL}/${id}`);
    const invoice = mockInvoices.find(inv => inv.id === id);
    return { data: invoice };
  } catch (error) {
    throw error;
  }
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  try {
    // In production: const response = await axios.post(API_URL, invoiceData);
    const newInvoice = { id: `INV-${Date.now()}`, ...invoiceData };
    return { data: newInvoice };
  } catch (error) {
    throw error;
  }
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  try {
    // In production: const response = await axios.put(`${API_URL}/${id}`, invoiceData);
    return { data: { id, ...invoiceData } };
  } catch (error) {
    throw error;
  }
};

// Delete invoice
export const deleteInvoice = async (id) => {
  try {
    // In production: const response = await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Record payment for invoice
export const recordPayment = async (invoiceId, paymentData) => {
  try {
    // In production: const response = await axios.post(`${API_URL}/${invoiceId}/payments`, paymentData);
    return { success: true, data: { id: Date.now(), ...paymentData } };
  } catch (error) {
    throw error;
  }
};

// Send invoice by email
export const sendInvoice = async (invoiceId, emailData) => {
  try {
    // In production: const response = await axios.post(`${API_URL}/${invoiceId}/send`, emailData);
    return { success: true };
  } catch (error) {
    throw error;
  }
};