import React, { useState, useEffect } from 'react'

  


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
      e.preventDefault();
      // Kirim permintaan login ke server Express di sini
      try {
          const response = await fetch('http://localhost:3000/api/login/user', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          // Jika login berhasil, set isLoggedIn menjadi true
          if (response.ok) {
              setIsLoggedIn(true);
          } else {
              alert(data.message); // Tampilkan pesan kesalahan jika login gagal
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Terjadi kesalahan saat mencoba login');
      }
  };
  return (
    <div className=''>
      <main>
      <section class="login">
         <div class="container">
            <div class="row justify-content-center">
               <div class="col-lg-5 col-md-6">
                  <h1 class="text-center mb-4">Gaming Portal</h1>
                  <div class="card card-default">
                     <div class="card-body">
                        <h3 class="mb-3">Sign In</h3>
                        
                        <form onSubmit={handleLogin}> 
                           <div class="form-group my-3">
                              <label for="username" class="mb-1 text-muted">Username</label>
                              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} class="form-control" autofocus />
                           </div> 

                           <div class="form-group my-3">
                              <label for="password" class="mb-1 text-muted">Password</label>
                              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)  } class="form-control" />
                           </div>
                           
                           <div class="mt-4 row">
                              <div class="col">
                                 <button type="submit" class="btn btn-primary w-100">Sign In</button>
                              </div>
                              <div class="col">
                                 <a href="Gaming Portal/signup.html" class="btn btn-danger w-100">Sign up</a>
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
