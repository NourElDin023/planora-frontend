// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const Home = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axiosInstance.get('hello/')
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage('Error connecting to API'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message}</h1>
    </div>
  );
};

export default Home;
