'use client';
import { useQueryClient } from '@tanstack/react-query';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { FaExternalLinkAlt, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import useApiHook from '@/hooks/useApi';
import { Button, Table, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';

const Report = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'team']) as any;

  const { data, isLoading, isFetching } = useApiHook({
    url: '/search-preference/report',
    method: 'GET',
    filter: `ownerId;${selectedProfile?.payload?._id}`,
    key: 'reports',
    enabled: !!selectedProfile?.payload?._id,
  }) as any;

  const { mutate: update } = useApiHook({
    method: 'PUT',
    key: 'update_report',
    queriesToInvalidate: ['reports'],
  }) as any;

  const { mutate: remove } = useApiHook({
    method: 'DELETE',
    key: 'delete_report',
    queriesToInvalidate: ['reports'],
    successMessage: 'Report deleted successfully',
  }) as any;

  return (
    <SearchWrapper
      placeholder="Filter reports"
      queryKey="reports"
      buttons={[]}
      filters={[
        {
          key: '',
          label: 'All',
        },
        {
          key: 'opened;true',
          label: 'Viewed',
        },
        {
          key: 'opened;false',
          label: 'Not Viewed',
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
        scroll={{ x: 'max-content' }}
        columns={[
          {
            title: 'Report Generated For',
            // This should be the name of the search preference, searchPreference.name
            key: 'reportId',
            render: (_, record) => <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record?.searchPreference?.name}</span>,
          },
          {
            title: '# of Opportunities',
            dataIndex: 'results',
            key: 'results',
            render: (text) => <span>{text?.length || 0}</span>,
          },
          {
            title: 'Viewed',
            dataIndex: 'opened',
            key: 'opened',
            render: (_, record) => <span>{record.opened ? 'Yes' : 'No'}</span>,
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Tooltip title="View Report">
                  <Button
                    onClick={() => {
                      router.push(`/opportunities_hub/reports/${record._id}`);
                    }}
                    type="link"
                  >
                    <FaExternalLinkAlt color="black" />
                  </Button>
                </Tooltip>
                <Tooltip title={!record.opened ? 'Mark as Viewed' : 'Mark as Not Viewed'}>
                  <Button
                    onClick={() => {
                      update({
                        url: `/search-preference/report/${record._id}`,
                        formData: { opened: !record.opened },
                      });
                    }}
                    type="link"
                  >
                    {/* Switches between a view and viewed icon */}
                    {!record.opened ? <FaEye color="black" /> : <FaEyeSlash color="black" />}
                  </Button>
                </Tooltip>
                <Tooltip title="Delete Report">
                  <Button
                    danger
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this report?')) {
                        remove({
                          url: `/search-preference/report/${record._id}`,
                        });
                      }
                    }}
                    type="link"
                  >
                    <FaTrash />
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

export default Report;
