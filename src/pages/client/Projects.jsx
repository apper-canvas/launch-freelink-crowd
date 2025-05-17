import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../../utils/iconUtils';

const ClientProjects = () => {
  // Sample project data - would come from an API in a real app
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding and improved user experience.',
      startDate: '2023-08-01',
      endDate: '2023-10-30',
      status: 'active',
      progress: 65,
      milestones: [
        { id: 1, name: 'Design Approval', completed: true, date: '2023-08-15' },
        { id: 2, name: 'Homepage Development', completed: true, date: '2023-09-01' },
        { id: 3, name: 'Content Migration', completed: false, date: '2023-09-30' },
        { id: 4, name: 'Testing & Launch', completed: false, date: '2023-10-25' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms with customer loyalty features.',
      startDate: '2023-09-15',
      endDate: '2023-12-15',
      status: 'active',
      progress: 30,
      milestones: [
        { id: 1, name: 'Requirements Gathering', completed: true, date: '2023-09-30' },
        { id: 2, name: 'UI/UX Design', completed: true, date: '2023-10-15' },
        { id: 3, name: 'Core Functionality', completed: false, date: '2023-11-15' },
        { id: 4, name: 'Beta Testing', completed: false, date: '2023-12-01' },
        { id: 5, name: 'App Store Submission', completed: false, date: '2023-12-10' }
      ]
    }
  ]);
  
  // Active project for details view
  const [activeProject, setActiveProject] = useState(null);
  
  // Icons
  const CalendarIcon = getIcon('Calendar');
  const CheckCircleIcon = getIcon('CheckCircle');
  const AlertCircleIcon = getIcon('AlertCircle');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const ChevronDownIcon = getIcon('ChevronDown');
  const FileTextIcon = getIcon('FileText');
  const LinkIcon = getIcon('Link');
  const MessageCircleIcon = getIcon('MessageCircle');
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Status badge styles
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };
  
  return (
    <div>
      {activeProject ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <button 
            onClick={() => setActiveProject(null)}
            className="flex items-center text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            <span>Back to Projects</span>
          </button>
          
          <div className="card mb-6">
            <div className="flex flex-wrap items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{activeProject.name}</h1>
                <p className="text-surface-600 dark:text-surface-400 mt-1">{activeProject.description}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusBadgeClass(activeProject.status)}`}>
                {activeProject.status.charAt(0).toUpperCase() + activeProject.status.slice(1)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-surface-600 dark:text-surface-400">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {formatDate(activeProject.startDate)} - {formatDate(activeProject.endDate)}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Progress</h3>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${activeProject.progress}%` }}></div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{activeProject.progress}% Complete</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Project Timeline</h3>
              <div className="space-y-4">
                {activeProject.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start">
                    <div className={`mt-0.5 ${milestone.completed ? 'text-green-500 dark:text-green-400' : 'text-surface-400 dark:text-surface-500'}`}>
                      {milestone.completed ? <CheckCircleIcon className="w-5 h-5" /> : <AlertCircleIcon className="w-5 h-5" />}
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${milestone.completed ? 'text-surface-900 dark:text-surface-100' : 'text-surface-700 dark:text-surface-300'}`}>
                        {milestone.name}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        Target: {formatDate(milestone.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
                Project Documents
              </h3>
              <ul className="space-y-3">
                <li className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <a href="#" className="flex items-center">
                    <span className="flex-1">Project Brief.pdf</span>
                    <LinkIcon className="w-4 h-4 text-primary" />
                  </a>
                </li>
                <li className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <a href="#" className="flex items-center">
                    <span className="flex-1">Design Assets.zip</span>
                    <LinkIcon className="w-4 h-4 text-primary" />
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircleIcon className="w-5 h-5 mr-2 text-primary" />
                Discussion
              </h3>
              <p className="text-surface-600 dark:text-surface-400 text-center py-6">
                Communication features coming soon!
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
          
          <div className="grid grid-cols-1 gap-4">
            {projects.map(project => (
              <motion.div
                key={project.id}
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="card hover:border-primary cursor-pointer transition-all"
                onClick={() => setActiveProject(project)}
              >
                <div className="flex flex-wrap items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">{project.description}</p>
                
                <div className="flex items-center text-surface-600 dark:text-surface-400 mb-3 text-sm">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>
                
                <div className="mb-2">
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-600 dark:text-surface-400">{project.progress}% Complete</span>
                  <button className="text-primary text-sm flex items-center">
                    <span>View Details</span>
                    <ChevronDownIcon className="w-4 h-4 ml-1 transform rotate-270" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientProjects;