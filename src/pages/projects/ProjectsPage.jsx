import { useState } from 'react';
import { getIcon } from '../../utils/iconUtils';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Icons
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
        <button
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-surface-800 p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center h-48 border-2 border-dashed border-surface-200 dark:border-surface-700">
          <p className="text-surface-600 dark:text-surface-400 text-center mb-4">No projects yet</p>
          <button className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white font-medium transition-colors">
            <PlusIcon className="w-5 h-5" /> Create your first project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;