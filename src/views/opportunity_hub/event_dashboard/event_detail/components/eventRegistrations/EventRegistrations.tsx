'use client';
import React from 'react';
import { Card, Empty } from 'antd';
import styles from './EventRegistrations.module.scss';

interface EventRegistrationsProps {
  eventId: string;
}

const EventRegistrations = ({ eventId }: EventRegistrationsProps) => {
  return (
    <div className={styles.registrationsContainer}>
      <Card>
        <Empty description="Registration management coming soon" />
      </Card>
    </div>
  );
};

export default EventRegistrations;
