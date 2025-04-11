// Button.tsx
import styles from './Button.module.css';

interface Proptypes {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode; // Change from string to React.ReactNode to allow any content
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

const Button = (props: Proptypes) => {
  const { type = 'button', children, color = 'primary', disabled = false } = props;
  return (
    <button
      className={`${styles.button} ${styles[`button-${color}`]}`}
      type={type}
      onClick={props.onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
