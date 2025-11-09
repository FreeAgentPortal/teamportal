import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Switch, Button, Space, Row, Col } from 'antd';
import { EventDocument, EventType, Visibility, Audience, LocationKind } from '@/types/IEventType';
import CustomQuestions, { CustomQuestion } from '../customQuestions/CustomQuestions';
import dayjs from 'dayjs';
import styles from './EventModal.module.scss';

const { TextArea } = Input;
const { Option } = Select;

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<EventDocument>) => void;
  event?: EventDocument | null; // For editing
  loading?: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose, onSubmit, event, loading = false }) => {
  const [form] = Form.useForm();
  const isEditing = !!event;

  // State for managing custom registration questions
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        // Populate form with event data for editing
        form.setFieldsValue({
          ...event,
          startsAt: event.startsAt ? dayjs(event.startsAt) : null,
          endsAt: event.endsAt ? dayjs(event.endsAt) : null,
          allDay: event.allDay || false,
          locationKind: event.location.kind,
          // Physical location fields
          venueName: event.location.physical?.venueName,
          addressLine1: event.location.physical?.addressLine1,
          addressLine2: event.location.physical?.addressLine2,
          city: event.location.physical?.city,
          state: event.location.physical?.state,
          postalCode: event.location.physical?.postalCode,
          country: event.location.physical?.country,
          // Virtual location fields
          meetingUrl: event.location.virtual?.meetingUrl,
          passcode: event.location.virtual?.passcode,
          platform: event.location.virtual?.platform,
          // Registration settings
          registrationRequired: event.registration?.required || false,
          registrationOpensAt: event.registration?.opensAt ? dayjs(event.registration.opensAt) : null,
          registrationClosesAt: event.registration?.closesAt ? dayjs(event.registration.closesAt) : null,
          capacity: event.registration?.capacity,
          waitlistEnabled: event.registration?.waitlistEnabled || false,
          allowWalkIns: event.registration?.allowWalkIns || false,
          price: event.registration?.price,
          currency: event.registration?.currency,
        });
        // Load existing questions
        if (event.registration?.questions) {
          setQuestions(event.registration.questions);
        } else {
          setQuestions([]);
        }
      } else {
        // Reset form for new event
        form.resetFields();
        setQuestions([]);
        // Set some defaults
        form.setFieldsValue({
          type: EventType.PRACTICE,
          audience: Audience.ATHLETES,
          visibility: Visibility.TEAM,
          locationKind: LocationKind.PHYSICAL,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          registrationRequired: false,
          waitlistEnabled: false,
          allowWalkIns: true,
          currency: 'USD',
          allDay: false,
        });
      }
    }
  }, [open, event, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Transform form values to EventDocument format
      const eventData: Partial<EventDocument> = {
        title: values.title,
        description: values.description,
        type: values.type,
        sport: values.sport,
        audience: values.audience,
        visibility: values.visibility,
        timezone: values.timezone,
        startsAt: values.startsAt?.toDate(),
        endsAt: values.endsAt?.toDate(),
        allDay: values.allDay,
        location: {
          kind: values.locationKind,
          physical:
            values.locationKind === LocationKind.PHYSICAL
              ? {
                  venueName: values.venueName,
                  addressLine1: values.addressLine1,
                  addressLine2: values.addressLine2,
                  city: values.city,
                  state: values.state,
                  postalCode: values.postalCode,
                  country: values.country,
                }
              : undefined,
          virtual:
            values.locationKind === LocationKind.VIRTUAL
              ? {
                  meetingUrl: values.meetingUrl,
                  passcode: values.passcode,
                  platform: values.platform,
                }
              : undefined,
        },
        registration: values.registrationRequired
          ? {
              required: values.registrationRequired,
              opensAt: values.registrationOpensAt?.toDate(),
              closesAt: values.registrationClosesAt?.toDate(),
              capacity: values.capacity,
              waitlistEnabled: values.waitlistEnabled,
              allowWalkIns: values.allowWalkIns,
              price: values.price,
              currency: values.currency,
              questions: questions, // Include custom questions
            }
          : undefined,
      };

      onSubmit(eventData);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setQuestions([]);
    onClose();
  };

  // Watch location kind to show/hide relevant fields
  const locationKind = Form.useWatch('locationKind', form);
  const registrationRequired = Form.useWatch('registrationRequired', form);

  return (
    <Modal
      title={isEditing ? 'Edit Event' : 'Create New Event'}
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>,
      ]}
      className={styles.modal}
    >
      <Form form={form} layout="vertical" className={styles.form} requiredMark={false}>
        {/* Basic Event Information */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Event Details</h4>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="title" label="Event Title" rules={[{ required: true, message: 'Please enter event title' }]}>
                <Input placeholder="Enter event title" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="Event Type" rules={[{ required: true, message: 'Please select event type' }]}>
                <Select placeholder="Select type">
                  {Object.values(EventType).map((type) => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter event description" showCount maxLength={500} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sport" label="Sport">
                <Input placeholder="e.g., Football, Soccer" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="audience" label="Target Audience" rules={[{ required: true, message: 'Please select audience' }]}>
                <Select>
                  {Object.values(Audience).map((audience) => (
                    <Option key={audience} value={audience}>
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visibility" label="Visibility" rules={[{ required: true, message: 'Please select visibility' }]}>
                <Select>
                  {Object.values(Visibility).map((visibility) => (
                    <Option key={visibility} value={visibility}>
                      {visibility
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Date & Time */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Date & Time</h4>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="timezone" label="Timezone" rules={[{ required: true, message: 'Please select timezone' }]}>
                <Select showSearch>
                  {/* Common timezones - in a real app, you'd have a full list */}
                  <Option value="America/New_York">Eastern Time (ET)</Option>
                  <Option value="America/Chicago">Central Time (CT)</Option>
                  <Option value="America/Denver">Mountain Time (MT)</Option>
                  <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                  <Option value="UTC">UTC</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allDay" valuePropName="checked" label=" ">
                <Switch checkedChildren="All Day" unCheckedChildren="Specific Time" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startsAt" label="Start Date & Time" rules={[{ required: true, message: 'Please select start date' }]}>
                <DatePicker showTime={!Form.useWatch('allDay', form)} format={Form.useWatch('allDay', form) ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'} className={styles.fullWidth} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endsAt" label="End Date & Time" rules={[{ required: true, message: 'Please select end date' }]}>
                <DatePicker showTime={!Form.useWatch('allDay', form)} format={Form.useWatch('allDay', form) ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'} className={styles.fullWidth} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Location */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Location</h4>

          <Form.Item name="locationKind" label="Location Type">
            <Select>
              <Option value={LocationKind.PHYSICAL}>Physical Location</Option>
              <Option value={LocationKind.VIRTUAL}>Virtual Event</Option>
            </Select>
          </Form.Item>

          {locationKind === LocationKind.PHYSICAL && (
            <>
              <Form.Item name="venueName" label="Venue Name">
                <Input placeholder="Enter venue name" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="addressLine1" label="Address Line 1">
                    <Input placeholder="Street address" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="addressLine2" label="Address Line 2">
                    <Input placeholder="Apt, suite, etc. (optional)" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="city" label="City">
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="state" label="State/Province">
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="postalCode" label="Postal Code">
                    <Input placeholder="Zip code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="country" label="Country">
                <Input placeholder="Country" defaultValue="United States" />
              </Form.Item>
            </>
          )}

          {locationKind === LocationKind.VIRTUAL && (
            <>
              <Form.Item name="meetingUrl" label="Meeting URL" rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
                <Input placeholder="https://zoom.us/j/..." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="platform" label="Platform">
                    <Select placeholder="Select platform">
                      <Option value="zoom">Zoom</Option>
                      <Option value="teams">Microsoft Teams</Option>
                      <Option value="meet">Google Meet</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="passcode" label="Meeting Passcode">
                    <Input placeholder="Meeting passcode (optional)" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </div>

        {/* Registration */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Registration</h4>

          <Form.Item name="registrationRequired" valuePropName="checked">
            <Switch checkedChildren="Registration Required" unCheckedChildren="No Registration" />
          </Form.Item>

          {registrationRequired && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="registrationOpensAt" label="Registration Opens">
                    <DatePicker showTime className={styles.fullWidth} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="registrationClosesAt" label="Registration Closes">
                    <DatePicker showTime className={styles.fullWidth} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="capacity" label="Capacity">
                    <InputNumber placeholder="Max participants" min={1} className={styles.fullWidth} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="price" label="Price">
                    <InputNumber placeholder="0.00" min={0} precision={2} className={styles.fullWidth} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="currency" label="Currency">
                    <Select defaultValue="USD">
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                      <Option value="GBP">GBP</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="waitlistEnabled" valuePropName="checked">
                    <Switch checkedChildren="Enable Waitlist" unCheckedChildren="No Waitlist" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="allowWalkIns" valuePropName="checked">
                    <Switch checkedChildren="Allow Walk-ins" unCheckedChildren="No Walk-ins" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Custom Registration Questions */}
              <CustomQuestions questions={questions} onChange={setQuestions} />
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EventModal;
