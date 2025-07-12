'use client';
import React, { useState, useEffect } from 'react';
import useApiHook from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, InputNumber, Button, Card, Space, Tag, Typography, Slider, Row, Col, message, Collapse, Tooltip, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, SaveOutlined, FilterOutlined } from '@ant-design/icons';
import styles from './Details.module.scss';
import formStyles from '@/styles/Form.module.scss';
import '@/styles/antd-overrides.scss';
import { ISearchPreferences } from '@/types/ISearchPreferences';
import { FOOTBALL_POSITIONS, PERFORMANCE_METRICS, METRICS_BY_CATEGORY, FREQUENCY_OPTIONS, OWNER_TYPE_OPTIONS, AGE_RANGE, PerformanceMetric } from '@/data/searchConstants';
import { useQueryClient } from '@tanstack/react-query';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const client = useQueryClient();
  const selectedProfile = client.getQueryData(['profile', 'team']) as any;
  const router = useRouter();
  const [form] = Form.useForm();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useApiHook({
    url: `/search-preference/${id}`,
    method: 'GET',
    key: ['search_preference', id],
    enabled: !!id,
  }) as any;

  const { mutate: updatePreference } = useApiHook({
    method: 'PUT',
    key: 'update_search_preference',
    successMessage: 'Search preference updated successfully',
    queriesToInvalidate: ['search_preference', id],
  }) as any;

  const { mutate: createPreference } = useApiHook({
    method: 'POST',
    key: 'create_search_preference',
    successMessage: 'Search preference created successfully',
  }) as any;

  useEffect(() => {
    if (data?.payload) {
      const preference = data.payload as ISearchPreferences;

      // Set form values
      form.setFieldsValue({
        ...preference,
        ageRange: preference.ageRange ? [preference.ageRange.min, preference.ageRange.max] : [AGE_RANGE.defaultMin, AGE_RANGE.defaultMax],
      });

      // Set selected metrics
      if (preference.performanceMetrics) {
        setSelectedMetrics(Object.keys(preference.performanceMetrics));
      }
    } else if (!id) {
      // Set default values for new preference
      form.setFieldsValue({
        ownerType: 'team',
        ageRange: [AGE_RANGE.defaultMin, AGE_RANGE.defaultMax],
        numberOfResults: 50,
        frequency: 1,
        frequencyType: 'weekly',
      });
    }
  }, [data?.payload, id, form]);

  const handleMetricToggle = (metricKey: string) => {
    setSelectedMetrics((prev) => {
      const newMetrics = prev.includes(metricKey) ? prev.filter((key) => key !== metricKey) : [...prev, metricKey];

      // Update form with current performance metrics
      const currentValues = form.getFieldsValue();
      const updatedMetrics = { ...currentValues.performanceMetrics };

      if (newMetrics.includes(metricKey) && !updatedMetrics[metricKey]) {
        const metric = PERFORMANCE_METRICS.find((m) => m.key === metricKey);
        updatedMetrics[metricKey] = {
          min: metric?.defaultMin || 0,
          max: metric?.defaultMax || 100,
        };
      } else if (!newMetrics.includes(metricKey)) {
        delete updatedMetrics[metricKey];
      }

      form.setFieldValue('performanceMetrics', updatedMetrics);
      return newMetrics;
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        ageRange: values.ageRange ? { min: values.ageRange[0], max: values.ageRange[1] } : undefined,
        performanceMetrics: selectedMetrics.reduce((acc, key) => {
          const metricValue = values.performanceMetrics?.[key];
          if (metricValue) {
            acc[key] = metricValue;
          }
          return acc;
        }, {} as any),
      };

      if (id) {
        updatePreference({ url: `/search-preference/${id}`, formData: formData });
      } else {
        createPreference(
          {
            url: '/search-preference',
            formData: { ...formData, ownerId: selectedProfile?.payload?._id, ownerType: 'team' },
          },
          {
            onSuccess: (response: any) => {
              router.push(`/opportunities_hub/search_preferences/${response.payload._id}`);
            },
          }
        );
      }
    } catch (error) {
      message.error('Failed to save search preference');
    } finally {
      setLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className={styles.container}>
        <Card loading style={{ minHeight: 400 }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Title level={2}>{id ? 'Edit Search Preference' : 'Create Search Preference'}</Title>
      <Text type="secondary">Build expressive search criteria to find athletes that match your team's needs</Text>

      <Form form={form} layout="vertical" onFinish={handleSubmit} className={formStyles.form} style={{ marginTop: 24 }} disabled={loading}>
        {/* Basic Information */}
        <Card title="Basic Information" style={{ marginBottom: 24 }}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name for this search' }]}>
            <Input placeholder="e.g., Elite Quarterbacks for 2025" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Describe what you're looking for in this search..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Frequency" name="frequency">
                <InputNumber min={1} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Frequency Type" name="frequencyType">
                <Select placeholder="Select frequency">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tags" name="tags">
                <Select mode="tags" placeholder="Add tags to categorize this search" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Exclusive Filters */}
        <Card title="Exclusive Filters" style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            Athletes must match ALL of these criteria
          </Text>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    Positions
                    <Tooltip title="Athletes must play at least one of these positions">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="positions"
              >
                <Select mode="multiple" allowClear placeholder="Select positions" style={{ width: '100%' }}>
                  {FOOTBALL_POSITIONS.map((position) => (
                    <Option key={position.value} value={position.value}>
                      {position.label} ({position.value})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    Age Range
                    <Tooltip title="Athletes must be within this age range">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="ageRange"
              >
                <Slider range min={AGE_RANGE.min} max={AGE_RANGE.max} marks={AGE_RANGE.marks} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Performance Metrics */}
        <Card title="Performance Metrics (OR Filters)" style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            Athletes need to match at least ONE of these performance criteria
          </Text>

          <Collapse ghost>
            {Object.entries(METRICS_BY_CATEGORY).map(([category, metrics]) => (
              <Panel header={category} key={category}>
                <Row gutter={[16, 16]}>
                  {metrics.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.key);
                    return (
                      <Col span={12} key={metric.key}>
                        <Card
                          size="small"
                          className={isSelected ? styles.selectedMetric : styles.metricCard}
                          onClick={() => handleMetricToggle(metric.key)}
                          style={{ cursor: 'pointer' }}
                          actions={
                            isSelected
                              ? [
                                  <DeleteOutlined
                                    key="delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMetricToggle(metric.key);
                                    }}
                                  />,
                                ]
                              : [<PlusOutlined key="add" />]
                          }
                        >
                          <Card.Meta
                            title={metric.label}
                            description={
                              <div>
                                <div>Unit: {metric.unit}</div>
                                {metric.description && <div style={{ fontSize: '12px', marginTop: 4, opacity: 0.8 }}>{metric.description}</div>}
                              </div>
                            }
                          />

                          {isSelected && (
                            <div style={{ marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                              <Row gutter={8}>
                                <Col span={12}>
                                  <Form.Item label="Min" name={['performanceMetrics', metric.key, 'min']} style={{ marginBottom: 8 }}>
                                    <InputNumber placeholder={metric.defaultMin?.toString() || 'Min'} style={{ width: '100%' }} size="small" step={metric.step || 1} min={0} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="Max" name={['performanceMetrics', metric.key, 'max']} style={{ marginBottom: 8 }}>
                                    <InputNumber placeholder={metric.defaultMax?.toString() || 'Max'} style={{ width: '100%' }} size="small" step={metric.step || 1} min={0} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Panel>
            ))}
          </Collapse>

          {selectedMetrics.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Selected Metrics: </Text>
              <Space wrap>
                {selectedMetrics.map((key) => {
                  const metric = PERFORMANCE_METRICS.find((m) => m.key === key);
                  return (
                    <Tag key={key} closable onClose={() => handleMetricToggle(key)} color="blue">
                      {metric?.label}
                    </Tag>
                  );
                })}
              </Space>
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={id ? <SaveOutlined /> : <SearchOutlined />}
              loading={loading}
              size="large"
              onClick={() => {
                form.submit();
              }}
            >
              {id ? 'Update Search Preference' : 'Create Search Preference'}
            </Button>
            <Button type="default" onClick={() => router.back()} size="large">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Details;
