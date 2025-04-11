import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import styles from './Home.module.css';

const Home = () => {
  return (
    <main className={styles.home}>
      <h1 className={styles.title}>Welcome To ALF Cafe</h1>
      <p className={styles.description}>
        Discover the best food, track your orders, and enjoy a seamless restaurant experience all in one place. Log in to get started!
      </p>
      <Link to="/login">
        <Button className={styles.loginButton}>Login</Button>
      </Link>
    </main>
  );
};

export default Home;
