import { getIcon } from '../../utils/iconUtils';

const InvoiceStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      badgeClass: 'badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      icon: 'FileEdit'
    },
    pending: {
      label: 'Pending',
      badgeClass: 'badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      icon: 'Clock'
    },
    paid: {
      label: 'Paid',
      badgeClass: 'badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      icon: 'CheckCircle'
    },
    overdue: {
      label: 'Overdue',
      badgeClass: 'badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      icon: 'AlertTriangle'
    },
    cancelled: {
      label: 'Cancelled',
      badgeClass: 'badge bg-surface-200 text-surface-800 dark:bg-surface-700 dark:text-surface-200',
      icon: 'XCircle'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = getIcon(config.icon);

  return (
    <span className={config.badgeClass}>
      <StatusIcon className="w-3 h-3 mr-1 inline" />
      {config.label}
    </span>
  );
};

export default InvoiceStatusBadge;