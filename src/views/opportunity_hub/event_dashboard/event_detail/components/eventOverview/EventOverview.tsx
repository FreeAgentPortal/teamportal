'use client';
import React from 'react';
import { Card, Row, Col, Descriptions, Tag, Badge, Divider } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { LocationKind } from '@/types/IEventType';
import dayjs from 'dayjs';
import styles from './EventOverview.module.scss';

interface EventOverviewProps {
  event: any;
}

const EventOverview = ({ event }: EventOverviewProps) => {
  const formatDateTime = (date: Date, allDay?: boolean) => {
    if (allDay) {
      return dayjs(date).format('MMMM D, YYYY');
    }
    return dayjs(date).format('MMMM D, YYYY [at] h:mm A');
  };

  const formatAddress = (physical: any) => {
    const parts = [physical?.addressLine1, physical?.addressLine2, physical?.city, physical?.state, physical?.postalCode, physical?.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className={styles.overviewContainer}>
      <Row gutter={[24, 24]}>
        {/* Left Column - Main Details */}
        <Col xs={24} lg={16}>
          {/* Event Description */}
          {event.description && (
            <Card className={styles.card}>
              <h3 className={styles.sectionTitle}>About This Event</h3>
              <p className={styles.description}>{event.description}</p>
            </Card>
          )}

          {/* Date & Time Information */}
          <Card className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <CalendarOutlined /> Date & Time
            </h3>
            <Descriptions column={1} className={styles.descriptions}>
              <Descriptions.Item label="Starts">
                <strong>{formatDateTime(event.startsAt, event.allDay)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Ends">
                <strong>{formatDateTime(event.endsAt, event.allDay)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Timezone">{event.timezone}</Descriptions.Item>
              {event.allDay && (
                <Descriptions.Item label="All Day Event">
                  <Badge status="success" text="Yes" />
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Location Information */}
          <Card className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <EnvironmentOutlined /> Location
            </h3>
            {event.location.kind === LocationKind.PHYSICAL ? (
              <div className={styles.locationDetails}>
                {event.location.physical?.venueName && <div className={styles.venueName}>{event.location.physical.venueName}</div>}
                <div className={styles.address}>{formatAddress(event.location.physical)}</div>
              </div>
            ) : (
              <div className={styles.locationDetails}>
                <div className={styles.virtualEvent}>
                  <Badge status="processing" text="Virtual Event" />
                </div>
                {event.location.virtual?.platform && <div className={styles.platform}>Platform: {event.location.virtual.platform}</div>}
                {event.location.virtual?.meetingUrl && (
                  <div className={styles.meetingLink}>
                    <a href={event.location.virtual.meetingUrl} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </div>
                )}
                {event.location.virtual?.passcode && <div className={styles.passcode}>Passcode: {event.location.virtual.passcode}</div>}
              </div>
            )}
          </Card>

          {/* Registration Details */}
          {event.registration?.required && (
            <Card className={styles.card}>
              <h3 className={styles.sectionTitle}>
                <UserOutlined /> Registration Information
              </h3>
              <Descriptions column={2} className={styles.descriptions}>
                {event.registration.opensAt && <Descriptions.Item label="Registration Opens">{formatDateTime(event.registration.opensAt)}</Descriptions.Item>}
                {event.registration.closesAt && <Descriptions.Item label="Registration Closes">{formatDateTime(event.registration.closesAt)}</Descriptions.Item>}
                {event.registration.capacity && (
                  <Descriptions.Item label="Capacity">
                    <strong>{event.registration.capacity} participants</strong>
                  </Descriptions.Item>
                )}
                {event.registration.price && event.registration.price > 0 && (
                  <Descriptions.Item label="Price">
                    <Tag color="gold" icon={<DollarOutlined />}>
                      {event.registration.currency || 'USD'} ${event.registration.price.toFixed(2)}
                    </Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Walk-ins">
                  <Badge status={event.registration.allowWalkIns ? 'success' : 'default'} text={event.registration.allowWalkIns ? 'Allowed' : 'Not Allowed'} />
                </Descriptions.Item>
                <Descriptions.Item label="Waitlist">
                  <Badge status={event.registration.waitlistEnabled ? 'processing' : 'default'} text={event.registration.waitlistEnabled ? 'Enabled' : 'Disabled'} />
                </Descriptions.Item>
              </Descriptions>

              {/* Custom Questions */}
              {event.registration.questions && event.registration.questions.length > 0 && (
                <>
                  <Divider />
                  <h4 className={styles.subsectionTitle}>Registration Questions</h4>
                  <div className={styles.questionsList}>
                    {event.registration.questions.map((question: any, index: number) => (
                      <div key={question.key} className={styles.questionItem}>
                        <div className={styles.questionLabel}>
                          {index + 1}. {question.label}
                          {question.required && <span className={styles.required}>*</span>}
                        </div>
                        <div className={styles.questionMeta}>
                          <Tag>{question.type}</Tag>
                          {question.options && question.options.length > 0 && <span className={styles.questionOptions}>Options: {question.options.join(', ')}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Opponents */}
          {event.opponents && event.opponents.length > 0 && (
            <Card className={styles.card}>
              <h3 className={styles.sectionTitle}>Opponents</h3>
              <div className={styles.opponentsList}>
                {event.opponents.map((opponent: any, index: number) => (
                  <Tag key={index} className={styles.opponentTag}>
                    {opponent.name}
                    {opponent.level && <span className={styles.opponentLevel}> ({opponent.level})</span>}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Media Gallery */}
          {event.media && event.media.length > 0 && (
            <Card className={styles.card}>
              <h3 className={styles.sectionTitle}>Event Media</h3>
              <Row gutter={[16, 16]}>
                {event.media.map((item: any, index: number) => (
                  <Col span={8} key={index}>
                    {item.kind === 'image' && <img src={item.url} alt={item.title || `Media ${index + 1}`} className={styles.mediaImage} />}
                    {item.kind === 'video' && <video src={item.url} controls className={styles.mediaVideo} />}
                    {item.kind === 'link' && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title || item.url}
                      </a>
                    )}
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>

        {/* Right Column - Sidebar */}
        <Col xs={24} lg={8}>
          {/* Quick Info Card */}
          <Card className={styles.sidebarCard}>
            <h3 className={styles.sectionTitle}>Event Overview</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Audience</div>
                <div className={styles.infoValue}>
                  <Tag color="purple">{event.audience.toUpperCase()}</Tag>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Visibility</div>
                <div className={styles.infoValue}>
                  <Tag color="cyan">{event.visibility.toUpperCase()}</Tag>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Status</div>
                <div className={styles.infoValue}>
                  <Tag
                    color={
                      event.status === 'scheduled'
                        ? 'green'
                        : event.status === 'completed'
                        ? 'blue'
                        : event.status === 'canceled'
                        ? 'red'
                        : event.status === 'postponed'
                        ? 'orange'
                        : 'default'
                    }
                  >
                    {event.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
              {event.sport && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Sport</div>
                  <div className={styles.infoValue}>{event.sport}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Eligibility Criteria */}
          {event.eligibility && (
            <Card className={styles.sidebarCard}>
              <h3 className={styles.sectionTitle}>Eligibility</h3>
              <div className={styles.eligibilityList}>
                {event.eligibility.positions && event.eligibility.positions.length > 0 && (
                  <div className={styles.eligibilityItem}>
                    <div className={styles.eligibilityLabel}>Positions:</div>
                    <div className={styles.eligibilityValue}>
                      {event.eligibility.positions.map((pos: any) => (
                        <Tag key={pos}>{pos}</Tag>
                      ))}
                    </div>
                  </div>
                )}
                {event.eligibility.ageRange && (
                  <div className={styles.eligibilityItem}>
                    <div className={styles.eligibilityLabel}>Age Range:</div>
                    <div className={styles.eligibilityValue}>
                      {event.eligibility.ageRange.min && `${event.eligibility.ageRange.min}+`}
                      {event.eligibility.ageRange.min && event.eligibility.ageRange.max && ' - '}
                      {event.eligibility.ageRange.max && `${event.eligibility.ageRange.max}`} years
                    </div>
                  </div>
                )}
                {event.eligibility.diamondMin && (
                  <div className={styles.eligibilityItem}>
                    <div className={styles.eligibilityLabel}>Min Rating:</div>
                    <div className={styles.eligibilityValue}>
                      <Tag color="gold">{event.eligibility.diamondMin}+ Diamonds</Tag>
                    </div>
                  </div>
                )}
                {event.eligibility.verifiedOnly && (
                  <div className={styles.eligibilityItem}>
                    <Badge status="success" text="Verified Athletes Only" />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <Card className={styles.sidebarCard}>
              <h3 className={styles.sectionTitle}>Tags</h3>
              <div className={styles.tagsList}>
                {event.tags.map((tag: any, index: number) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className={styles.sidebarCard}>
            <h3 className={styles.sectionTitle}>Event Details</h3>
            <div className={styles.metadataList}>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>Created:</div>
                <div className={styles.metadataValue}>{dayjs(event.createdAt).format('MMM D, YYYY')}</div>
              </div>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>Last Updated:</div>
                <div className={styles.metadataValue}>{dayjs(event.updatedAt).fromNow()}</div>
              </div>
              {event.publishedAt && (
                <div className={styles.metadataItem}>
                  <div className={styles.metadataLabel}>Published:</div>
                  <div className={styles.metadataValue}>{dayjs(event.publishedAt).format('MMM D, YYYY')}</div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventOverview;
