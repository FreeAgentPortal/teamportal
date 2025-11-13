import React from 'react';
import { InfoCircleOutlined, TeamOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import EventOverview from './components/eventOverview/EventOverview';
import EventRegistrations from './components/eventRegistrations/EventRegistrations';
import EventPosts from './components/eventPosts/EventPosts';
import EventSettings from './components/eventSettings/EventSettings';
import { formatNumber } from '@/utils/formatNumber';

export const getEventDetailTabs = (event: any, eventId: string) => {
  return [
    {
      key: 'overview',
      label: (
        <span>
          <InfoCircleOutlined />
          Overview
        </span>
      ),
      children: <EventOverview event={event} />,
    },
    {
      key: 'registrations',
      label: (
        <span>
          <TeamOutlined />
          Registrations <span>({formatNumber(event.registrations.total)})</span>
        </span>
      ),
      children: <EventRegistrations eventId={eventId} />,
    },
    {
      key: 'posts',
      label: (
        <span>
          <FileTextOutlined />
          Posts
        </span>
      ),
      children: <EventPosts eventId={eventId} />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: <EventSettings eventId={eventId} />,
    },
  ];
};
