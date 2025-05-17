import axios from 'axios';

// Demo client credentials - would be replaced by real API in production
const DEMO_CLIENTS = [
  { id: '1', email: 'client@example.com', password: 'password', name: 'Sarah Johnson', role: 'client', companyId: '1' },
  { id: '2', email: 'michael@techsolutions.com', password: 'password', name: 'Michael Rodriguez', role: 'client', companyId: '2' }
];

const login = async (credentials) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = credentials;
      const user = DEMO_CLIENTS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Create a simple JWT-like token (for demo purposes)
        const token = btoa(JSON.stringify({
          sub: user.id,
          name: user.name,
          role: user.role,
          exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        // Store in localStorage
        localStorage.setItem('freelink-token', token);
        localStorage.setItem('freelink-user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }));
        
        resolve({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
      } else {
        reject({ message: 'Invalid email or password' });
      }
    }, 500); // Simulate network delay
  });
};

const logout = () => {
  localStorage.removeItem('freelink-token');
  localStorage.removeItem('freelink-user');
  return Promise.resolve();
};

export default { login, logout };