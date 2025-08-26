import { Button } from 'antd';
import styles from './Button.module.scss';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

const TheButton = (props: Props) => {
  return (
    <div className={styles.container}>
      <Button
        className={`${styles.button} ${styles[props.type || 'primary']} ${styles[props.size || 'medium']} ${props.className || ''} ${props.disabled ? styles.disabled : ''} ${
          props.loading ? styles.loading : ''
        }`}
        icon={props.icon}
        onClick={props.onClick}
        disabled={props.disabled || props.loading}
      >
        {props.loading ? <span className={styles.loader}></span> : props.children}
      </Button>
    </div>
  );
};

export default TheButton;
