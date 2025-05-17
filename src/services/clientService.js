// Mock client data for demonstration
const mockClients = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc',
    status: 'active',
    createdAt: '2023-05-15T08:30:00Z',
    notes: 'Website redesign project'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1 (555) 987-6543',
    company: 'XYZ Corporation',
    status: 'active',
    createdAt: '2023-06-20T10:15:00Z',
    notes: 'Ongoing monthly SEO services'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Innovative Solutions',
    status: 'inactive',
    createdAt: '2023-03-10T14:45:00Z',
    notes: 'Project completed, may need maintenance in the future'
  },
  {
    id: '4',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Tech Startups Ltd',
    status: 'lead',
    createdAt: '2023-08-05T09:00:00Z',
    notes: 'Interested in mobile app development'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all clients
export const getClients = async () => {
  // Simulate API request
  await delay(800);
  return [...mockClients];
};

// Get client by ID
export const getClientById = async (id) => {
  await delay(500);
  const client = mockClients.find(c => c.id === id);
  if (!client) throw new Error('Client not found');
  return {...client};
};

// Add new client
export const addClient = async (clientData) => {
  await delay(1000);
  const newClient = {
    ...clientData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  mockClients.push(newClient);
  return newClient;
};

// Update client
export const updateClient = async (id, clientData) => {
  await delay(1000);
  const index = mockClients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Client not found');
  const updatedClient = { ...mockClients[index], ...clientData, id };
  mockClients[index] = updatedClient;
  return updatedClient;
};

// Delete client
export const deleteClient = async (id) => {
  await delay(800);
  const index = mockClients.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Client not found');
  mockClients.splice(index, 1);
  return { success: true };
};