import React from 'react';
import styles from './AthleteList.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import AthleteCard, { athleteColumns } from '../athleteCard/AthleteCard.component';
import { List, Table } from 'antd';

interface ListProps {
  data: IAthlete[];
  isTable?: boolean;
}

const AthleteList = ({ data, isTable }: ListProps) => {
  if (isTable) {
    return <Table className={styles.athleteTable} columns={athleteColumns} dataSource={data} />;
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={data}
      renderItem={(athlete) => (
        <List.Item>
          <AthleteCard key={athlete._id} athlete={athlete} />
        </List.Item>
      )}
    />
  );
};

export default AthleteList;

const calculateAge = (birthdate: string) => {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
