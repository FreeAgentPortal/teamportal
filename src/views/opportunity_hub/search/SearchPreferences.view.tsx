'use client';
import useApiHook from '@/hooks/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaExternalLinkAlt, FaPlay, FaPlus, FaRunning, FaTrash } from 'react-icons/fa';

const SearchPreferences = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'team']) as any;

  const { data, isLoading, isFetching } = useApiHook({
    url: '/search-preference',
    method: 'GET',
    filter: `ownerId;${selectedProfile?.payload?._id}`,
    key: 'search_preferences',
    enabled: !!selectedProfile?.payload?._id,
  }) as any;

  const { mutate: removePreference } = useApiHook({
    method: 'DELETE',
    key: 'search_remove',
    queriesToInvalidate: ['search_preferences'],
  }) as any;

  const { mutate: triggerRun } = useApiHook({
    method: 'POST',
    key: 'search_run',
    queriesToInvalidate: ['search_preferences'],
    onSuccessCallback(payload) {
      router.push(`/opportunities_hub/reports/${payload.data._id}`);
    },
  }) as any;

  return (
    <SearchWrapper
      placeholder="Filter search preferences"
      queryKey="search_preferences"
      buttons={[
        {
          icon: <FaPlus />,
          toolTip: 'Create Search',
          type: 'link',
          href: '/opportunities_hub/search_preferences/create',
          onClick: () => {},
        },
      ]}
      filters={[
        {
          key: '',
          label: 'All',
        },
      ]}
      sort={[
        {
          key: '',
          label: 'Default',
        },
      ]}
      total={data?.payload?.totalCount}
      isFetching={isFetching}
    >
      <Table
        dataSource={data?.payload}
        loading={isLoading}
        pagination={false}
        rowKey={(record: any) => record._id}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>,
          },
          {
            title: 'Frequency',
            dataIndex: 'frequencyType',
          },
          {
            title: 'Date Last Ran',
            dataIndex: 'dateLastRan',
            render: (date) => {
              return date ? new Date(date).toLocaleDateString() : 'Never';
            },
          },
          {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => <span>{tags?.length > 0 ? tags.join(', ') : 'No tags'}</span>,
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/opportunities_hub/search_preferences/${record._id}`} passHref>
                  <Button>
                    <FaExternalLinkAlt />
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    removePreference({ url: `/search-preference/${record._id}` });
                  }}
                >
                  <FaTrash style={{ color: 'red' }} />
                </Button>
                <Tooltip title="Trigger Search">
                  <Button
                    onClick={() => {
                      triggerRun({ url: `/search-preference/scheduler/trigger/${record._id}` });
                    }}
                  >
                    <FaPlay style={{ color: 'green' }} />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </SearchWrapper>
  );
};

export default SearchPreferences;
