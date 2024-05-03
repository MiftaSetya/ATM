import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Newrek() {
    const [Pemilik, setPemilik] = useState('');
    const [Pin, setPassword] = useState('');
    const [NamaBank, setBank] = useState('');
    const [Saldo, setSaldo] = useState('');
    const [error, setError] = useState('');
    const [rekening, setRekening] = useState([]);
    const history = useNavigate();
    const { isUserAuthenticated, idU, logoutU } = React.useContext(AuthContext);

    if (!isUserAuthenticated) {
        history('/login-user');
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/rekeningbaru', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Pemilik, NamaBank, Pin, Saldo }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Username atau Password salah');
            }
            console.log(data);
            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Terjadi kesalahan saat login');
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedValue = inputValue.replace(/\D/g, '');
        setPassword(sanitizedValue);
    }

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
                <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-cyan-950 h-screen  sidebar">
                    <div class="sidebar-sticky pt-3">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link text-white text-primary " aria-current="page" href="/dashboard-user">
                                    All Account
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-white text-primary active" href="/dashboard-user/create">
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

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <form onSubmit={handleCreate}>
                        <div className='flex gap-2 w-full'>
                            <div class="form-group my-3 w-full">
                                <label for="Pemilik" class="mb-1 text-muted">Nama Account</label>
                                <input type="text" id="Pemilik" name="Pemilik" value={Pemilik} onChange={(e) => setPemilik(e.target.value)} class="form-control" autofocus />
                            </div>

                            <div class="form-group my-3 w-full">
                                <label htmlFor="bankSelect" className="mb-1 text-muted">Bank</label>
                                <select
                                    id="bankSelect"
                                    name="NamaBank"
                                    value={NamaBank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className="form-select"
                                    autoFocus
                                >
                                    <option value="">Select Bank</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="Mandiri">Mandiri</option>
                                    {/* Tambahkan opsi-opsi bank lainnya sesuai kebutuhan */}
                                </select>
                            </div>
                        </div>

                        <div className='flex gap-2 w-full'>
                            <div class="form-group my-3 w-full">
                                <label for="password" class="mb-1 text-muted">Pin</label>
                                <input type="password" id="pin" name='password' class='form-control' value={Pin} onChange={handleInputChange} />
                            </div>

                            <div class="form-group my-3 w-full">
                                <label for="Saldo" class="mb-1 text-muted">Saldo Awal</label>
                                <input type="number" id="Saldo" name="Saldo" value={Saldo} onChange={(e) => setSaldo(e.target.value)} class="form-control" autofocus />
                            </div>
                        </div>

                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        <div class="mt-4 row">
                            <div class="col">
                                <button type="submit" class="btn btn-primary w-100">Create</button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>


    );
}
