import React from 'react';
import styles from '../Info.module.scss';
import { Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import BenefitModal from './BenefitModal.component';
import { Benefit } from '@/types/ITeamType';

const Benefits = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'team']) as any;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [selectedBenefit, setSelectedBenefit] = React.useState<Benefit | undefined>(undefined);
  const [selectedBenefitIndex, setSelectedBenefitIndex] = React.useState<number | undefined>(undefined);

  const selectBenefit = (benefit: Benefit | undefined, index: number | undefined) => {
    setSelectedBenefit(benefit);
    setSelectedBenefitIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Team benefits</h1>
        <p className={styles.description}>Highlight your team by adding some of its benefits here.</p>
      </div>

      {profile?.payload?.benefits?.map((benefit: Benefit, index: number) => (
        <div key={index} className={styles.benefitContainer} onClick={() => selectBenefit(benefit, index)}>
          <h1 className={styles.benefitTitle}>{benefit.title}</h1>
          <p className={styles.benefitDescription}>{benefit.description}</p>
        </div>
      ))}
      <Button className={styles.button} size="large" onClick={() => selectBenefit(undefined, undefined)} onSubmit={(e) => e.preventDefault()} type="primary">
        + Add benefit
      </Button>

      <BenefitModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} benefit={selectedBenefit} index={selectedBenefitIndex} />
    </div>
  );
};

export default Benefits;
