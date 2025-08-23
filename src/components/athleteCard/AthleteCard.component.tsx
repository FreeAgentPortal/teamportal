import styles from './AthleteCard.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import Image from 'next/image';
import Link from 'next/link';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';
import { Button } from 'antd';
import { useFavoriteAthlete } from '@/hooks/useFavoriteAthlete';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { PositionBadges } from '../positionBadge/PositionBadges.component';

interface CardProps {
  athlete: IAthlete;
}

const AthleteCard = ({ athlete }: CardProps) => {
  const { isFavorited, handleToggleFavoriteAthlete } = useFavoriteAthlete(athlete);
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
        <div className={styles.ratingBadge}>
          <DiamondRating rating={athlete.diamondRating || 0} maxRating={5} size="small" showValue={true} />
        </div>
        <div className={styles.favoriteBtn}>
          <Button
            type="link"
            icon={isFavorited() ? <MdFavorite /> : <MdFavoriteBorder />}
            onClick={(e) => {
              e.preventDefault();
              handleToggleFavoriteAthlete();
            }}
          />
        </div>

        <div className={styles.meta}>
          <span className={styles.age}>Age: {calculateAge(athlete?.birthdate as any)}</span>
          <span className={styles.birthdate}>Born: {new Date(athlete?.birthdate as any).toLocaleDateString()}</span>
        </div>

        {/* Positions */}
        <PositionBadges positions={athlete?.positions?.map((pos) => pos.abbreviation) || []} />
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
