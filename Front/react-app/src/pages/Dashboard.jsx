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

        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-cyan-950 min-h-screen  sidebar">
          <div class="sidebar-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link text-white text-primary active" aria-current="page" href="/dashboard-user">
                  All Account
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white text-primary " href="/dashboard-user/create">
                  Create Account
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white text-primary" href="manage-games.html">
                  Manage Games
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white text-primary" href="profile.html">
                  User Profile
                </a>
              </li>
            </ul>
          </div>
        </nav>



        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
          {/* <div className='flex flex-col '>
            <div className='flex flex-col justify-center w-full px-6 self-center'>
              <div className='flex font-extrabold my-10 justify-between'>

                <div className='flex flex-col w-full border-slate-500 border-b-2'>
                  <div className=' bg-slate-400 border-slate-500 border-2 py-2 text-xl px-3'>
                    Nama
                  </div>
                  {rekening.map((item) => (
                    <div className='font-normal border-2 border-slate-500 border-y-0 py-1 px-3 w-full '>
                      {item.Pemilik}
                    </div>
                  ))}
                </div>

                <div className='flex flex-col w-full border-slate-500 border-b-2'>
                  <div className=' bg-slate-400 border-slate-500 border-2 py-2 text-xl px-3'>
                    Bank
                  </div>
                  {rekening.map((item) => (
                    <div className='font-normal border-2 border-slate-500 border-y-0 py-1 px-3 w-full'>
                      {item.NamaBank}
                    </div>
                  ))}
                </div>

                <div className='flex flex-col w-full border-slate-500 border-b-2'>
                  <div className=' bg-slate-400 border-slate-500 border-2 py-2 text-xl px-3'>
                    Nomor Kartu
                  </div>
                  {rekening.map((item) => (
                    <div className='font-normal border-2 border-slate-500 border-y-0 py-1 px-3 w-full'>
                      {item.NoKartu}
                    </div>
                  ))}
                </div>

                <div className='flex flex-col w-full border-slate-500 border-b-2'>
                  <div className=' bg-slate-400 border-slate-500 border-2 py-2 text-xl px-3'>
                    Pin
                  </div>
                  {rekening.map((item) => (
                    <div className='font-normal border-2 border-slate-500 border-y-0 py-1 px-3 w-full'>
                      ******
                    </div>
                  ))}
                </div>
                
                <div className='flex flex-col w-full border-slate-500 border-b-2'>
                  <div className=' bg-slate-400 border-slate-500 border-2 py-2 text-xl px-3'>
                    Saldo
                  </div>
                  {rekening.map((item) => (
                    <div className='font-normal border-2 border-slate-500 border-y-0 py-1 px-3 w-full'>
                      Rp.{item.Saldo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
          <div class="list-form py-5">
            <div class="container">
              <h6 class="mb-3">List Semua Rekening</h6>

              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Nama Pemilik</th>
                    <th>Nomor Kartu</th>
                    <th>Bank</th>
                    <th>Saldo</th>
                    <th>Pin</th>
                  </tr>
                </thead>
                <tbody>
                  {rekening.map((item) => (
                    <tr>
                      <td>{item.Pemilik}</td>
                      <td>{item.NoKartu}</td>
                      <td>{item.NamaBank}</td>
                      <td>Rp.{item.Saldo}</td>
                      <td>
                        <span class="hover-pin">
                          <span class="pin-info">{item.Pin}</span>
                          <span class="pin-deploy">*********</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </main>
      </div>
    </div>


  );
}
