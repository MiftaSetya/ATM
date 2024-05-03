import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [rekening, setRekening] = useState([]);
  const history = useNavigate();
  const { isUserAuthenticated, idU, logoutU } = React.useContext(AuthContext);

  if (!isUserAuthenticated) {
    history('/login-user');
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
    <div class="container-fluid">
      <div class="row">
      <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
              <div class="container">
                <a class="navbar-brand" >Dashboard User</a>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">

                  <li class="nav-item">
                    <a class="btn bg-white text-primary ms-4 hover:bg-sky-900" onClick={logoutU}>Sign Out</a>
                  </li>
                </ul>
              </div>
            </nav>
        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="sidebar-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="discover-games.html">
                  Discover Games
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="manage-games.html">
                  Manage Games
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="profile.html">
                  User Profile
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div>
            

            <div class="list-form py-5">
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <a href="detail-games.html" class="card card-default mb-3">
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="mb-1">Demo Game 3 <small class="text-muted">By Dev2</small></h5>
                            <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, numquam repellendus perspiciatis cupiditate veritatis porro quod eveniet animi perferendis molestias debitis temporibus, asperiores iusto.</div>
                            <hr class="mt-1 mb-1" />
                            <div class="text-muted">#scores submitted : 1143</div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

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
        </main>
      </div>
    </div>


  );
}
