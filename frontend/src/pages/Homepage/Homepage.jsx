import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/Button/Button';
import styles from './Homepage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Button onClick={() => navigate('/create-account')}>Create an Account</Button>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    </>
  );
};

export default HomePage;
