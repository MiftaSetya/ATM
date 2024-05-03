import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [rekening, setRekening] = useState([]);
  const history = useNavigate();
  const { isUserAuthenticated, idU, logoutU } = React.useContext(AuthContext);

  if (!isUserAuthenticated) {
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
      <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="index.html">Dashboard User</a>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          
         <li><a href="discover-games.html" class="nav-link px-2 text-white">Discover Games</a></li>
         <li><a href="manage-games.html" class="nav-link px-2 text-white">Manage Games</a></li>
         <li><a href="profile.html" class="nav-link px-2 text-white">User Profile</a></li>
         <li class="nav-item">
           <a class="nav-link active bg-dark" href="#">Welcome, {idU}</a>
         </li> 
         <li class="nav-item">
          <a class="btn bg-white text-primary ms-4" onClick={logoutU}>Sign Out</a>
         </li>
       </ul> 
      </div>
    </nav>

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
