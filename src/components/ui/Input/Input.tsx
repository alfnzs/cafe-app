import styles from './Input.module.css';

interface Proptypes {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string; // Add value prop
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}

const Input = (props: Proptypes) => {
  const {
    label,
    name,
    id,
    type = 'text',
    placeholder,
    required = false,
    value, // Destructure value prop
    onChange, // Destructure onChange prop
  } = props;

  return (
    <label htmlFor={id} className={styles.label}>
      {label}
      <input
        type={type}
        id={id}
        className={styles.input}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value} // Pass value to the input element
        onChange={onChange} // Pass onChange to the input element
      />
    </label>
  );
};

export default Input;
