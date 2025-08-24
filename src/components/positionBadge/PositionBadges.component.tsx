import styles from './PositionBadges.module.scss';
import { getPositionColor } from '@/utils/getPostionColor';
export const PositionBadges = ({ positions }: { positions: string[] }) => {
  return (
    <div className={styles.positions}>
      {positions.map((position) => (
        <span
          key={position}
          className={styles.positionBadge}
          style={{ background: 'linear-gradient(135deg, ' + getPositionColor(position) + ', ' + getPositionColor(position) + '90)' }}
        >
          {position}
        </span>
      ))}
    </div>
  );
};
