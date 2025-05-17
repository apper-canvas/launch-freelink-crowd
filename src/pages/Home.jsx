import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Initial demo data
const initialClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'Innovate Design Co.',
    email: 'sarah@innovatedesign.com',
    phone: '(555) 123-4567',
    status: 'active',
    lastInteraction: '2023-09-15T10:30:00',
    tags: ['design', 'long-term']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'TechSolutions Inc.',
    email: 'michael@techsolutions.com',
    phone: '(555) 987-6543',
    status: 'active',
    lastInteraction: '2023-09-12T14:00:00',
    tags: ['development', 'high-priority']
  },
  {
    id: '3',
    name: 'Emily Chen',
    company: 'GreenEarth Marketing',
    email: 'emily@greenearth.com',
    phone: '(555) 234-5678',
    status: 'inactive',
    lastInteraction: '2023-08-30T11:15:00',
    tags: ['marketing', 'project-based']
  },
  {
    id: '4',
    name: 'David Wilson',
    company: 'Wilson Consulting',
    email: 'david@wilsonconsulting.com',
    phone: '(555) 876-5432',
    status: 'prospect',
    lastInteraction: '2023-09-05T16:45:00',
    tags: ['consulting', 'new']
  }
];

const initialProjects = [
  {
    id: '1',
    clientId: '1',
    name: 'Website Redesign',
    startDate: '2023-08-01',
    endDate: '2023-10-30',
    status: 'active',
    progress: 65
  },
  {
    id: '2',
    clientId: '2',
    name: 'Mobile App Development',
    startDate: '2023-09-15',
    endDate: '2023-12-15',
    status: 'active',
    progress: 30
  },
  {
    id: '3',
    clientId: '3',
    name: 'Content Marketing Campaign',
    startDate: '2023-07-01',
    endDate: '2023-09-01',
    status: 'completed',
    progress: 100
  }
];

const initialInvoices = [
  {
    id: '1',
    clientId: '1',
    projectId: '1',
    issueDate: '2023-09-01',
    dueDate: '2023-09-15',
    amount: 2500,
    status: 'paid'
  },
  {
    id: '2',
    clientId: '2',
    projectId: '2', 
    issueDate: '2023-09-10',
    dueDate: '2023-09-24',
    amount: 4000,
    status: 'pending'
  },
  {
    id: '3',
    clientId: '3',
    projectId: '3',
    issueDate: '2023-08-15',
    dueDate: '2023-08-29',
    amount: 1800,
    status: 'overdue'
  }
];

const Home = () => {
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('freelink-clients');
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });
  
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('freelink-projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem('freelink-invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : initialInvoices;
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');

  useEffect(() => {
    localStorage.setItem('freelink-clients', JSON.stringify(clients));
    localStorage.setItem('freelink-projects', JSON.stringify(projects));
    localStorage.setItem('freelink-invoices', JSON.stringify(invoices));
  }, [clients, projects, invoices]);

  // Calculate summary metrics for the dashboard
  const activeClientsCount = clients.filter(client => client.status === 'active').length;
  const pendingInvoicesCount = invoices.filter(invoice => invoice.status === 'pending').length;
  const overdueInvoicesCount = invoices.filter(invoice => invoice.status === 'overdue').length;
  const upcomingDeadlinesCount = projects.filter(project => 
    project.status === 'active' && new Date(project.endDate) > new Date() && 
    new Date(project.endDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  ).length;
  
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoiceAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingInvoiceAmount = invoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Icons
  const UsersIcon = getIcon('Users');
  const FileTextIcon = getIcon('FileText');
  const AlertCircleIcon = getIcon('AlertCircle');
  const CalendarIcon = getIcon('Calendar');
  const DollarSignIcon = getIcon('DollarSign');
  const BarChartIcon = getIcon('BarChart');
  const CheckCircleIcon = getIcon('CheckCircle');
  const Clock3Icon = getIcon('Clock3');
  const PlusIcon = getIcon('Plus');

  // Animate client counts
  const handleTestNotification = () => {
    toast.success("This is how notifications will appear when you perform actions!");
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to FreeLink</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Your client relationship management hub
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              className="btn-primary flex items-center"
              onClick={handleTestNotification}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              <span>New Client</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">Active Clients</p>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-200 mt-2">
                  {activeClientsCount}
                </h3>
              </div>
              <div className="rounded-full p-2 bg-blue-200 dark:bg-blue-800">
                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-amber-700 dark:text-amber-300 font-medium">Pending Invoices</p>
                <h3 className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-200 mt-2">
                  {pendingInvoicesCount}
                </h3>
              </div>
              <div className="rounded-full p-2 bg-amber-200 dark:bg-amber-800">
                <FileTextIcon className="w-6 h-6 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium">Overdue Invoices</p>
                <h3 className="text-2xl md:text-3xl font-bold text-red-800 dark:text-red-200 mt-2">
                  {overdueInvoicesCount}
                </h3>
              </div>
              <div className="rounded-full p-2 bg-red-200 dark:bg-red-800">
                <AlertCircleIcon className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">Upcoming Deadlines</p>
                <h3 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200 mt-2">
                  {upcomingDeadlinesCount}
                </h3>
              </div>
              <div className="rounded-full p-2 bg-green-200 dark:bg-green-800">
                <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Financial Overview</h2>
                <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg overflow-hidden">
                  {['week', 'month', 'year'].map(timeframe => (
                    <button
                      key={timeframe}
                      className={`px-3 py-1 text-sm font-medium ${
                        selectedTimeframe === timeframe 
                          ? 'bg-primary text-white' 
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                      }`}
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <p className="text-surface-500 dark:text-surface-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold">${totalInvoiceAmount.toLocaleString()}</p>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="text-surface-500 dark:text-surface-400 text-sm">Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${paidInvoiceAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">Outstanding</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    ${pendingInvoiceAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center text-surface-400">
                <div className="flex flex-col items-center">
                  <BarChartIcon className="w-12 h-12 mb-2" />
                  <p className="text-center">Financial data visualization will appear here</p>
                  <p className="text-sm text-surface-500">Showing data for the past {selectedTimeframe}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card h-full">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { 
                    icon: CheckCircleIcon, 
                    bgClass: 'bg-green-100 dark:bg-green-900/30', 
                    textClass: 'text-green-600 dark:text-green-400', 
                    text: 'Invoice #2305 was paid', 
                    time: '2 hours ago' 
                  },
                  { icon: UsersIcon, bgClass: 'bg-blue-100 dark:bg-blue-900/30', textClass: 'text-blue-600 dark:text-blue-400', text: 'New client Acme Corp. added', time: '1 day ago' },
                  { icon: FileTextIcon, bgClass: 'bg-amber-100 dark:bg-amber-900/30', textClass: 'text-amber-600 dark:text-amber-400', text: 'Invoice #2304 was sent', time: '2 days ago' },
                  { icon: Clock3Icon, bgClass: 'bg-purple-100 dark:bg-purple-900/30', textClass: 'text-purple-600 dark:text-purple-400', text: 'Meeting scheduled with Sarah', time: '3 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-2 rounded-full ${activity.bgClass} mr-3`}>
                      <activity.icon className={`w-5 h-5 ${activity.textClass}`} />
                    </div>
                    <div>
                      <p className="text-surface-800 dark:text-surface-200">{activity.text}</p>
                      <p className="text-sm text-surface-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full py-2 text-sm text-primary dark:text-primary-light hover:underline">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <MainFeature clients={clients} setClients={setClients} />
      
    </div>
  );
};

export default Home;