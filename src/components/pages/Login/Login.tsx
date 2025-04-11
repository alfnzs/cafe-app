import { FormEvent } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import styles from './Login.module.css';
import { login } from '../../../services/auth.service';
import { setLocalStorage } from '../../../utils/storage';

const Login = () => {
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const payload = {
      email: form.email.value,
      password: form.password.value,
    };
    const result = await login(payload);
    setLocalStorage('auth', result.token);
    window.location.href = '/orders';
  };

  return (
    <main className={styles.login}>
      {/* Information about the app outside the card */}
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>Welcome to ALF Cafe</h1>
        <p className={styles.subtitle}>Your go-to restaurant app for easy ordering and management!</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Login</h2>

        <form className={styles.form} onSubmit={handleLogin}>
        <Input
            label=" "
            name="email"
            id="email"
            type="email"
            placeholder="Insert Email"
            required
          />
          <Input
            label=" "
            name="password"
            id="password"
            type="password"
            placeholder="Insert Password"
            required
          />
          <Button type="submit" className={styles.loginButton}>Login</Button>
        </form>
      </div>

      {/* Additional information outside the card */}
      <p className={styles.infoText}>
        Manage orders, track customers, and keep your restaurant running smoothly — all in one place.
      </p>
    </main>
  );
};

export default Login;
