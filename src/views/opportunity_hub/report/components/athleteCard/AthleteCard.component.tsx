import React from 'react';
import styles from './AthleteCard.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import Image from 'next/image';
import Link from 'next/link';
import { Button, TableProps, Tag } from 'antd';

export const athleteColumns: TableProps<IAthlete>['columns'] = [
  {
    title: 'Photo',
    render: (_: any, record: IAthlete) => (
      <Image
        src={record.profileImageUrl || '/images/no-photo.png'}
        alt={record.fullName}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/no-photo.png';
        }}
        width={50}
        height={50}
        style={{ borderRadius: '50%' }}
      />
    ),
    key: 'photo',
  },
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'name',
  },
  {
    title: 'Age',
    key: 'age',
    render: (_: any, record: IAthlete) => calculateAge(record.birthdate as any),
  },
  {
    title: 'Positions',
    key: 'positions',
    render: (_: any, record: IAthlete) => (
      <div className={styles.positions}>
        {record?.positions?.map((position) => (
          <span key={position?._id} className={styles.positionBadge}>
            {position?.abbreviation}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Birthdate',
    key: 'birthdate',
    render: (_: any, record: IAthlete) => new Date(record.birthdate as any).toLocaleDateString(),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_: any, record: IAthlete) => (
      <Link href={`/opportunities_hub/athletes/${record._id}`} passHref>
        <Button type="primary">View</Button>
      </Link>
    ),
  },
];

interface CardProps {
  athlete: IAthlete;
}

const AthleteCard = ({ athlete }: CardProps) => {
  return (
    <Link href={`/opportunities_hub/athletes/${athlete._id}`} passHref className={styles.card}>
      {/* Athlete Photo */}
      <div className={styles.imageWrapper}>
        <Image
          src={athlete.profileImageUrl || '/images/no-photo.png'}
          alt={athlete.fullName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/no-photo.png';
          }}
          width={200}
          height={400}
          className={styles.image}
        />
      </div>

      {/* Info Section */}
      <div className={styles.info}>
        <h2 className={styles.name}>{athlete.fullName}</h2>

        <div className={styles.meta}>
          <span className={styles.age}>Age: {calculateAge(athlete?.birthdate as any)}</span>
          <span className={styles.birthdate}>Born: {new Date(athlete?.birthdate as any).toLocaleDateString()}</span>
        </div>

        {/* Positions */}
        <div className={styles.positions}>
          {athlete?.positions?.map((position) => (
            <span key={position?._id} className={styles.positionBadge}>
              {position?.abbreviation}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default AthleteCard;

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
