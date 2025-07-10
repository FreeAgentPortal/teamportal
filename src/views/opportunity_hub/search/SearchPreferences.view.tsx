'use client';
import useApiHook from '@/hooks/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const SearchPreferences = () => {
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'team']) as any;

  const { data, isLoading, isFetching } = useApiHook({
    url: '/search-preference',
    method: 'GET',
    filter: `ownerId;${selectedProfile?.payload?._id}`,
    key: 'search_preferences',
    enabled: !!selectedProfile?.payload?._id,
  }) as any;
  return (
    <SearchWrapper
      placeholder="Filter search preferences"
      queryKey="search_preferences"
      buttons={[
        {
          icon: <FaPlus />,
          toolTip: 'Add new API Key',
          type: 'link',
          onClick: () => {},
        },
      ]}
      filters={[
        {
          key: '',
          label: 'All',
        },
        {
          key: 'isActive;true',
          label: 'Active',
        },
        {
          key: 'isActive;false',
          label: 'Expired',
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
      // disableButtons={isFetching}
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
            render: (text, record) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  onClick={() => {
                    // handleDelete(record._id);
                  }}
                >
                  <FaTrash style={{ color: 'red' }} />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </SearchWrapper>
  );
};

export default SearchPreferences;
