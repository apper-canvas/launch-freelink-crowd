import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../../utils/iconUtils';

const ClientDocuments = () => {
  // Sample document data - would come from an API in a real app
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Project Brief.pdf', category: 'Contracts', added: '2023-09-05', size: '1.2 MB', project: 'Website Redesign' },
    { id: 2, name: 'Design Mockups.zip', category: 'Design', added: '2023-09-12', size: '4.5 MB', project: 'Website Redesign' },
    { id: 3, name: 'Contract.docx', category: 'Contracts', added: '2023-09-02', size: '450 KB', project: 'Mobile App Development' },
    { id: 4, name: 'Requirements.pdf', category: 'Planning', added: '2023-09-18', size: '780 KB', project: 'Mobile App Development' },
    { id: 5, name: 'Timeline.xlsx', category: 'Planning', added: '2023-09-08', size: '320 KB', project: 'Website Redesign' }
  ]);
  
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  
  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const FileIcon = getIcon('File');
  const DownloadIcon = getIcon('Download');
  const FileTextIcon = getIcon('FileText');
  const FileImageIcon = getIcon('FileImage');
  const FileArchiveIcon = getIcon('FileArchive');
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    // Apply search query filter
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) {
      return false;
    }
    
    // Apply project filter
    if (projectFilter !== 'all' && doc.project !== projectFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get document icon based on file extension
  const getDocumentIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return <FileImageIcon className="w-6 h-6 text-purple-500" />;
    } else if (['zip', 'rar', '7z'].includes(extension)) {
      return <FileArchiveIcon className="w-6 h-6 text-amber-500" />;
    } else if (['pdf'].includes(extension)) {
      return <FileTextIcon className="w-6 h-6 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FileTextIcon className="w-6 h-6 text-blue-500" />;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <FileTextIcon className="w-6 h-6 text-green-500" />;
    } else {
      return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };
  
  // Get unique categories and projects for filters
  const categories = [...new Set(documents.map(doc => doc.category))];
  const projects = [...new Set(documents.map(doc => doc.project))];
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">Documents</h1>
        
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-64 md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-4 h-4 text-surface-500" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4 text-surface-500" />
                <select
                  className="bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4 text-surface-500" />
                <select
                  className="bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Document</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Project</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Added</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Size</th>
                  <th className="text-right py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-surface-500 dark:text-surface-400">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map(doc => (
                    <tr key={doc.id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {getDocumentIcon(doc.name)}
                          <span className="ml-3 font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                        {doc.category}
                      </td>
                      <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                        {doc.project}
                      </td>
                      <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                        {formatDate(doc.added)}
                      </td>
                      <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                        {doc.size}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="p-1.5 rounded-lg text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                          <DownloadIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientDocuments;