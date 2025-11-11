'use client';
import React from 'react';
import { Card, Empty } from 'antd';
import styles from './EventSettings.module.scss';

interface EventSettingsProps {
  eventId: string;
}

const EventSettings = ({ eventId }: EventSettingsProps) => {
  return (
    <div className={styles.settingsContainer}>
      <Card>
        <Empty description="Event settings coming soon" />
      </Card>
    </div>
  );
};

export default EventSettings;
