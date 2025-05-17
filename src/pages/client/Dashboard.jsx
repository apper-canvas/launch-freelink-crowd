import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIcon } from '../../utils/iconUtils';

const ClientDashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  // Sample data - would come from API in real application
  const projects = [
    { id: 1, name: 'Website Redesign', status: 'active', progress: 65, dueDate: '2023-10-30' },
    { id: 2, name: 'Mobile App Development', status: 'active', progress: 30, dueDate: '2023-12-15' }
  ];
  
  const invoices = [
    { id: 1, amount: 2500, status: 'paid', date: '2023-09-01' },
    { id: 2, amount: 4000, status: 'pending', date: '2023-09-10' }
  ];
  
  const documents = [
    { id: 1, name: 'Project Brief.pdf', added: '2023-09-05', size: '1.2 MB' },
    { id: 2, name: 'Contract.docx', added: '2023-09-02', size: '450 KB' },
    { id: 3, name: 'Timeline.xlsx', added: '2023-09-08', size: '780 KB' }
  ];
  
  // Icons
  const FolderIcon = getIcon('Folder');
  const FileTextIcon = getIcon('FileText');
  const MessageSquareIcon = getIcon('MessageSquare');
  const ChevronRightIcon = getIcon('ChevronRight');
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name || 'Client'}</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-6">Here's an overview of your projects and recent activities</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link to="/client/projects" className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg text-white mr-4">
                <FolderIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">{projects.length} Projects</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">View your active projects</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-blue-500" />
            </div>
          </Link>
          
          <Link to="/client/documents" className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg text-white mr-4">
                <FileTextIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">{documents.length} Documents</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Access shared files</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-green-500" />
            </div>
          </Link>
          
          <Link to="/client/messages" className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg text-white mr-4">
                <MessageSquareIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Messages</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Communicate with your consultant</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-purple-500" />
            </div>
          </Link>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          {projects.map(project => (
            <div key={project.id} className="mb-4 last:mb-0">
              <h3 className="font-medium">{project.name}</h3>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mt-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">Progress: {project.progress}%</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ClientDashboard;