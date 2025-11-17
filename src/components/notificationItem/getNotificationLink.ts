import NotificationType from '@/types/NotificationType';

export default (notification: NotificationType) => {
  switch (notification.notificationType) {
    case 'search.report':
      return `/opportunities_hub/reports/${notification.entityId}`;
    case 'support':
      return `/account_details/support/${notification.entityId}`;
    default:
      return '/';
  }
};
