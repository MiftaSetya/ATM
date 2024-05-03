import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [rekening, setRekening] = useState([]);
  const history = useNavigate();
  const { isAuthenticated } = React.useContext(AuthContext);

  if (!isAuthenticated) {
    history('/login/user');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/rekening'); // Endpoint API Express
        if (!response.ok) {
          throw new Error('Gagal mendapatkan data rekening');
        }
        const data = await response.json();
        setRekening(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Daftar Rekening</h1>
      <ul>
        {rekening.map((item) => (
          <li key={item.ID}>
            <strong>Pemilik:</strong> {item.Pemilik}, 
            <strong> Nama Bank:</strong> {item.NamaBank}, 
            <strong> No Kartu:</strong> {item.NoKartu}, 
            <strong> Pin:</strong> {item.Pin}
          </li>
        ))}
      </ul>
    </div>
  );
}
