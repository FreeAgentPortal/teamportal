import styles from './AthleteList.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import AthleteCard from '../athleteCard/AthleteCard.component';
import { Button, List, Table, TableProps } from 'antd';
import Image from 'next/image';
import DiamondRating from '@/components/diamondRating';
import Link from 'next/link';
import { useFavoriteAthlete } from '@/hooks/useFavoriteAthlete';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { PositionBadges } from '../positionBadge/PositionBadges.component';

interface ListProps {
  data: IAthlete[];
  isTable?: boolean;
}

const AthleteList = ({ data, isTable }: ListProps) => {
  const { isFavorited, handleToggleFavoriteAthlete } = useFavoriteAthlete();

  const athleteColumns: TableProps<IAthlete>['columns'] = [
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
      render: (_: any, athlete: IAthlete) => <PositionBadges positions={athlete?.positions?.map((pos) => pos.abbreviation) || []} />,
    },
    {
      title: 'Birthdate',
      key: 'birthdate',
      render: (_: any, record: IAthlete) => new Date(record.birthdate as any).toLocaleDateString(),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: any, record: IAthlete) => <DiamondRating rating={record.diamondRating || 0} maxRating={5} size="small" showValue={true} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, athlete: IAthlete) => (
        <>
          <Link href={`/opportunities_hub/athletes/${athlete._id}`} passHref>
            <Button type="text">View</Button>
          </Link>
          <Button
            type="link"
            icon={isFavorited(athlete) ? <MdFavorite /> : <MdFavoriteBorder />}
            onClick={() => handleToggleFavoriteAthlete(athlete)}
            className={styles.conversationBtn}
            disabled={!athlete._id}
          />
        </>
      ),
    },
  ];

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
