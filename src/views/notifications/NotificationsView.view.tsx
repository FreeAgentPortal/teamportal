'use client';
import Container from '@/layout/container/Container.layout';
import styles from './NotificationsView.module.scss';
import Link from 'next/link';
import { Badge, Button, Empty, Skeleton } from 'antd';
import { AiFillDelete, AiFillExclamationCircle } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import Error from '@/components/error/Error.component';
import { useState } from 'react';
import getNotificationLink from '@/utils/getNotificationLink';
import NotificationItem from '@/components/notificationItem/NotificationItem.component';
import NotificationType from '@/types/NotificationType';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/state/auth';

const NotificationsView = () => {
  const { data: loggedInUser } = useUser();

  // Create include query for user and all profile references
  const createIncludeQuery = () => {
    if (!loggedInUser) return '';

    // Start with the user's direct ID
    const includeItems = [`userTo;${loggedInUser._id}`];

    // Add all profileRefs if they exist
    if (loggedInUser.profileRefs && typeof loggedInUser.profileRefs === 'object') {
      Object.values(loggedInUser.profileRefs).forEach((profileId) => {
        if (profileId && profileId !== null) {
          includeItems.push(`userTo;${profileId}`);
        }
      });
    }

    return includeItems.join('|');
  };

  const { data } = useApiHook({
    url: `/notification`,
    key: ['notifications', 'view'],
    method: 'GET',
    filter: `userTo;${loggedInUser?._id}`,
    limit: 20,
  }) as any;

  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ['notifications'],
    key: 'notifications',
    method: 'POST',
  }) as any;
  return (
    <Container
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
            }}
          >
            Notifications
          </span>
          <Button type="primary" onClick={() => updateNotification({ url: '' })}>
            Mark all Read
          </Button>
        </div>
      }
    >
      <div className={styles.notifications}>
        {data?.payload?.length > 0 ? (
          data?.payload.map((notification: NotificationType) => {
            return <NotificationItem notification={notification} key={notification.entityId} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )}
      </div>
    </Container>
  );
};

export default NotificationsView;
