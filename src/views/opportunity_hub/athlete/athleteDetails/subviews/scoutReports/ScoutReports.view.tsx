import React, { useState } from 'react';
import { Card, Empty, Button, Tag, Rate, Timeline, Row, Col, Modal } from 'antd';
import { FileTextOutlined, EyeOutlined, CalendarOutlined, UserOutlined, StarOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './ScoutReports.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import moment from 'moment';

interface ScoutReportsViewProps {
  athlete?: IAthlete;
}

// Mock data structure for scout reports (this would come from API)
interface ScoutReport {
  _id: string;
  scoutName: string;
  scoutOrganization: string;
  date: Date;
  overallRating: number;
  position: string;
  summary: string;
  detailedAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
  videoAnalysis?: {
    highlightUrl: string;
    gameFootageUrl: string;
    notes: string;
  };
  categories: {
    technical: number;
    physical: number;
    mental: number;
    tactical: number;
  };
}

const ScoutReportsView: React.FC<ScoutReportsViewProps> = ({ athlete }) => {
  const [selectedReport, setSelectedReport] = useState<ScoutReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock scout reports data - in real app this would come from API
  const mockScoutReports: ScoutReport[] = [
    {
      _id: '1',
      scoutName: 'John Mitchell',
      scoutOrganization: 'Elite Sports Scouting',
      date: new Date('2024-11-15'),
      overallRating: 4.2,
      position: 'Quarterback',
      summary: 'Exceptional arm strength with good accuracy on intermediate routes. Shows strong leadership qualities and pocket presence.',
      detailedAnalysis:
        'This athlete demonstrates remarkable potential with strong fundamentals and excellent game awareness. Technical skills are well-developed for their age group, particularly in terms of throwing mechanics and footwork. Shows excellent decision-making under pressure and maintains composure in high-stress situations.',
      strengths: ['Strong arm', 'Good accuracy', 'Leadership', 'Pocket presence', 'Quick release'],
      weaknesses: ['Mobility in pocket', 'Deep ball consistency', 'Play action timing'],
      recommendations: 'Focus on mobility drills and continue developing deep ball accuracy. Consider additional film study for play action development.',
      categories: {
        technical: 4.3,
        physical: 4.1,
        mental: 4.5,
        tactical: 4.0,
      },
    },
    {
      _id: '2',
      scoutName: 'Sarah Williams',
      scoutOrganization: 'Pro Prospects Network',
      date: new Date('2024-10-22'),
      overallRating: 4.0,
      position: 'Quarterback',
      summary: 'Solid fundamentals with room for growth. Good coachability and work ethic evident in performance improvement.',
      detailedAnalysis:
        'Shows consistent improvement game over game. Fundamentals are solid and athlete appears very coachable. Physical tools are developing well and mental approach to the game is mature for this level.',
      strengths: ['Coachable', 'Consistent improvement', 'Good fundamentals', 'Team player'],
      weaknesses: ['Arm strength', 'Footwork under pressure', 'Red zone efficiency'],
      recommendations: 'Continue strength training program. Work on footwork drills and red zone scenario practice.',
      categories: {
        technical: 3.8,
        physical: 3.9,
        mental: 4.2,
        tactical: 4.1,
      },
    },
  ];

  const scoutReports = mockScoutReports; // In real app, fetch based on athlete._id

  const handleViewReport = (report: ScoutReport) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const getCategoryColor = (rating: number) => {
    if (rating >= 4.0) return 'var(--success)';
    if (rating >= 3.0) return 'var(--warning)';
    return 'var(--error)';
  };

  if (!scoutReports || scoutReports.length === 0) {
    return (
      <div className={styles.container}>
        <Empty description="No scout reports available" className={styles.empty} image={<FileTextOutlined className={styles.emptyIcon} />}>
          <p className={styles.emptySubtext}>Scout reports will appear here once evaluations are completed.</p>
        </Empty>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Scout Reports</h2>
        <p className={styles.description}>Professional evaluations and assessments for {athlete?.fullName}</p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{scoutReports.length}</span>
            <span className={styles.statLabel}>Total Reports</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{(scoutReports.reduce((sum, report) => sum + report.overallRating, 0) / scoutReports.length).toFixed(1)}</span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {scoutReports.map((report) => (
          <Col xs={24} lg={12} key={report._id}>
            <Card
              className={styles.reportCard}
              actions={[
                <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => handleViewReport(report)} className={styles.viewButton}>
                  View Full Report
                </Button>,
              ]}
            >
              <div className={styles.reportHeader}>
                <div className={styles.scoutInfo}>
                  <h3 className={styles.scoutName}>{report.scoutName}</h3>
                  <p className={styles.organization}>{report.scoutOrganization}</p>
                  <div className={styles.reportMeta}>
                    <span className={styles.date}>
                      <CalendarOutlined /> {moment(report.date).format('MMM DD, YYYY')}
                    </span>
                    <Tag className={styles.positionTag}>{report.position}</Tag>
                  </div>
                </div>
                <div className={styles.rating}>
                  <div className={styles.ratingNumber}>{report.overallRating}</div>
                  <Rate disabled value={report.overallRating} allowHalf />
                </div>
              </div>

              <div className={styles.summary}>
                <p>{report.summary}</p>
              </div>

              <div className={styles.categories}>
                {Object.entries(report.categories).map(([category, rating]) => (
                  <div key={category} className={styles.categoryItem}>
                    <span className={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <div
                      className={styles.categoryBar}
                      style={{
                        background: `linear-gradient(to right, ${getCategoryColor(rating)} ${rating * 20}%, var(--border) ${rating * 20}%)`,
                      }}
                    >
                      <span className={styles.categoryRating}>{rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Highlight Videos Section */}
      {athlete?.highlightVideos && athlete.highlightVideos.length > 0 && (
        <Card
          className={styles.videosCard}
          title={
            <div className={styles.cardTitle}>
              <PlayCircleOutlined className={styles.cardIcon} />
              Highlight Videos
            </div>
          }
        >
          <div className={styles.videoGrid}>
            {athlete.highlightVideos.map((videoUrl, index) => (
              <div key={index} className={styles.videoItem}>
                <div className={styles.videoThumbnail}>
                  <PlayCircleOutlined className={styles.playIcon} />
                </div>
                <p className={styles.videoTitle}>Highlight Reel #{index + 1}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Report Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <FileTextOutlined className={styles.modalIcon} />
            Scout Report - {selectedReport?.scoutName}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        className={styles.reportModal}
      >
        {selectedReport && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <p>
                  <UserOutlined /> {selectedReport.scoutOrganization}
                </p>
                <p>
                  <CalendarOutlined /> {moment(selectedReport.date).format('MMMM DD, YYYY')}
                </p>
                <Tag color="blue">{selectedReport.position}</Tag>
              </div>
              <div className={styles.modalRating}>
                <div className={styles.overallRating}>
                  <span className={styles.ratingLabel}>Overall Rating</span>
                  <div className={styles.ratingDisplay}>
                    <span className={styles.ratingNumber}>{selectedReport.overallRating}</span>
                    <Rate disabled value={selectedReport.overallRating} allowHalf />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.analysisSection}>
              <h4>Detailed Analysis</h4>
              <p>{selectedReport.detailedAnalysis}</p>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <TrophyOutlined className={styles.sectionIcon} />
                    Strengths
                  </h4>
                  <div className={styles.tagList}>
                    {selectedReport.strengths.map((strength, index) => (
                      <Tag key={index} color="green" className={styles.strengthTag}>
                        {strength}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Areas for Improvement</h4>
                  <div className={styles.tagList}>
                    {selectedReport.weaknesses.map((weakness, index) => (
                      <Tag key={index} color="orange" className={styles.weaknessTag}>
                        {weakness}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            <div className={styles.recommendationsSection}>
              <h4>Recommendations</h4>
              <p>{selectedReport.recommendations}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScoutReportsView;
