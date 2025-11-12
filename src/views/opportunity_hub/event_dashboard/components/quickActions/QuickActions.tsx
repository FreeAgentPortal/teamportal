import React from 'react';
import styles from './QuickActions.module.scss';

interface QuickActionsProps {
  onCreateEvent?: () => void;
  onViewCalendar?: () => void;
  onExportEvents?: () => void;
  onManageTemplates?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onCreateEvent, onViewCalendar, onExportEvents, onManageTemplates }) => {
  // Placeholder handlers
  const handleCreateEvent = () => {
    onCreateEvent?.();
  };

  const handleViewCalendar = () => {
    onViewCalendar?.();
  };

  const handleExportEvents = () => {
    onExportEvents?.();
  };

  const handleManageTemplates = () => {
    onManageTemplates?.();
  };

  const actions = [
    {
      id: 'create-event',
      label: 'Create Event',
      icon: '➕',
      handler: handleCreateEvent,
      primary: true,
    },
  ];

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Quick Actions</h4>

      <div className={styles.actionsList}>
        {actions.map((action) => (
          <button key={action.id} className={`${styles.actionButton} ${action.primary ? styles.primary : ''}`} onClick={action.handler}>
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
