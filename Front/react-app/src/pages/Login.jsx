import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router DOM
import { AuthContext } from '../AuthContext';

export default function Login() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const history = useNavigate(); // Initialize useHistory
   const { login } = React.useContext(AuthContext);

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch('http://localhost:3000/login/user', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
         });
         const data = await response.json();
         if (!response.ok) {
            throw new Error(data.error || 'Username atau Password salah');
         }
         setError('');
         login();
         history('/dashboard'); // Navigate to /dashboard after successful login
      } catch (error) {
         console.error('Error:', error);
         setError(error.message || 'Terjadi kesalahan saat login');
      }
   };

   return (
      <div className=''>
         <main>
            <section class="login">
               <div class="container">
                  <div class="row justify-content-center">
                     <div class="col-lg-5 col-md-6">
                        <div class="card card-default">
                           <div class="card-body">
                              <h3 class="mb-3">Login</h3>
                              {error && <div style={{ color: 'red' }}>{error}</div>}
                              <form onSubmit={handleLogin}>
                                 <div class="form-group my-3">
                                    <label for="username" class="mb-1 text-muted">Username</label>
                                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} class="form-control" autofocus />
                                 </div>

                                 <div class="form-group my-3">
                                    <label for="password" class="mb-1 text-muted">Password</label>
                                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} class="form-control" />
                                 </div>

                                 <div class="mt-4 row">
                                    <div class="col">
                                       <button type="submit" class="btn btn-primary w-100">Login</button>
                                    </div>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </main>
      </div>
   )
}
