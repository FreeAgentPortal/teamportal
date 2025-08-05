import React, { useState } from 'react';
import { Card, Empty, Button, Tag, Rate, Timeline, Row, Col, Modal } from 'antd';
import { FileTextOutlined, EyeOutlined, CalendarOutlined, UserOutlined, StarOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './ScoutReports.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import moment from 'moment';
import useApiHook from '@/hooks/useApi';
import { IScoutReport } from '@/types/IScoutReport';
import ScoutReportCard from '@/components/scoutReportCard/ScoutReportCard.component';

interface ScoutReportsViewProps {
  athlete?: IAthlete;
}

const ScoutReportsView: React.FC<ScoutReportsViewProps> = ({ athlete }) => {
  const [selectedReport, setSelectedReport] = useState<IScoutReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data } = useApiHook({
    url: `/scout`,
    method: 'GET',
    filter: `athleteId;{"$eq": "${athlete?._id}"}`,
    enabled: !!athlete?._id,
    key: 'scoutReports',
  }) as any;

  const scoutReports = data?.payload || [];

  const handleViewReport = (report: IScoutReport) => {
    setSelectedReport(report);
    setModalVisible(true);
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
            <span className={styles.statNumber}>
              {scoutReports.length > 0 ? (scoutReports.reduce((sum: number, report: IScoutReport) => sum + report.diamondRating, 0) / scoutReports.length).toFixed(1) : '0.0'}
            </span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {scoutReports.map((report: IScoutReport) => (
          <Col xs={24} lg={24} key={report._id}>
            <ScoutReportCard report={report} onClick={() => handleViewReport(report)} />
          </Col>
        ))}
      </Row>
      {/* Detailed Report Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <FileTextOutlined className={styles.modalIcon} />
            Scout Report - {selectedReport?.scout.displayName || selectedReport?.scout.user.fullName}
            {selectedReport?.isPublic === false && <span className={styles.privateModalBadge}>🔒 Private</span>}
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
                  <UserOutlined /> {selectedReport.scout.displayName || selectedReport.scout.user.fullName}
                </p>
                <p>
                  <CalendarOutlined /> {moment(selectedReport.createdAt).format('MMMM DD, YYYY')}
                </p>
                {selectedReport.isPublic !== false && (
                  <>
                    <p>
                      {selectedReport.sport} - {selectedReport.league}
                    </p>
                    <Tag color="blue">{selectedReport.reportType}</Tag>
                  </>
                )}
              </div>
              <div className={styles.modalRating}>
                <div className={styles.overallRating}>
                  <span className={styles.ratingLabel}>Diamond Rating</span>
                  <div className={styles.ratingDisplay}>
                    <span className={styles.ratingNumber}>{selectedReport.diamondRating}</span>
                    <Rate disabled value={selectedReport.diamondRating} allowHalf />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.analysisSection}>
              <h4>General Observations</h4>
              <p>{selectedReport.observations || 'No observations available'}</p>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <TrophyOutlined className={styles.sectionIcon} />
                    Strengths
                  </h4>
                  <div className={styles.tagList}>
                    {selectedReport.strengths?.map((strength: string, index: number) => (
                      <Tag key={index} color="green" className={styles.strengthTag}>
                        {strength}
                      </Tag>
                    )) || <p>No strengths recorded</p>}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Areas for Improvement</h4>
                  <div className={styles.tagList}>
                    {selectedReport.weaknesses?.map((weakness: string, index: number) => (
                      <Tag key={index} color="orange" className={styles.weaknessTag}>
                        {weakness}
                      </Tag>
                    )) || <p>No weaknesses recorded</p>}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Only show detailed information for public reports */}
            {selectedReport.isPublic !== false && (
              <>
                <div className={styles.recommendationsSection}>
                  <h4>Recommendations</h4>
                  <p>{selectedReport.recommendations || 'No recommendations available'}</p>
                </div>

                {/* Rating Breakdown - Only for public reports */}
                {Object.keys(selectedReport.ratingBreakdown).length > 0 && (
                  <div className={styles.ratingBreakdownSection}>
                    <h4>Rating Breakdown</h4>
                    <div className={styles.ratingCategories}>
                      {Object.entries(selectedReport.ratingBreakdown).map(([category, ratingField]) => (
                        <div key={category} className={styles.categoryItem}>
                          <span className={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                          <div className={styles.categoryRating}>
                            <span className={styles.score}>{ratingField.score}</span>
                            {ratingField.comments && <p className={styles.comments}>{ratingField.comments}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Private report notice */}
            {selectedReport.isPublic === false && (
              <div className={styles.privateNotice}>
                <p>🔒 This is a private scout report. Additional details are restricted and only available to authorized personnel.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScoutReportsView;
