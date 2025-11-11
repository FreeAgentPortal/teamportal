'use client';
import React from 'react';
import { Card, Empty } from 'antd';
import styles from './EventPosts.module.scss';

interface EventPostsProps {
  eventId: string;
}

const EventPosts = ({ eventId }: EventPostsProps) => {
  return (
    <div className={styles.postsContainer}>
      <Card>
        <Empty description="Event posts and updates coming soon" />
      </Card>
    </div>
  );
};

export default EventPosts;
