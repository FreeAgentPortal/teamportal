import React from 'react';
import styles from './AthleteCard.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import Image from 'next/image';
import Link from 'next/link';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';

interface CardProps {
  athlete: IAthlete;
}

const AthleteCard = ({ athlete }: CardProps) => {
  return (
    <div className={styles.athleteCard}>
      {/* Diamond Rating - Top Right Corner */}
      <div className={styles.ratingBadge}>
        <DiamondRating rating={athlete.diamondRating || 0} maxRating={5} size="small" showValue={true} />
      </div>

      <div className={styles.athleteImage}>
        <Image
          src={athlete.profileImageUrl || '/images/no-photo.png'}
          alt={athlete.fullName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/no-photo.png';
          }}
          width={300}
          height={300}
        />
      </div>
      <div className={styles.athleteInfo}>
        <h3 className={styles.athleteName}>{athlete.fullName}</h3>

        <div className={styles.athleteDetails}>
          <div className={styles.athleteAge}>Age: {calculateAge(athlete?.birthdate as any)}</div>
          <div className={styles.athletePositions}>
            {athlete?.positions?.map((position) => (
              <span key={position?._id} className={styles.positionBadge}>
                {position?.abbreviation}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.birthdate}>Born: {new Date(athlete?.birthdate as any).toLocaleDateString()}</div>
      </div>
      <div className={styles.cardActions}>
        <Link href={`/opportunities_hub/athletes/${athlete._id}`} className={styles.viewProfileLink} passHref>
          <button className={styles.viewButton}>View Profile</button>
        </Link>
      </div>
    </div>
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
