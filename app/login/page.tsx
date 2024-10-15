'use client';




import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isRegistering
        ? 'http://localhost:3001/register'
        : 'http://localhost:3001/login';
      const response = await axios.post(url, { username, password });

      if (!isRegistering) {
        // If login, store the token
        localStorage.setItem('token', response.data.token);
        router.push('/'); // Redirect to the main page
      } else {
        // After registration, redirect to login
        setIsRegistering(false);
      }
    } catch (err) {
      console.log(err);
      setError(isRegistering ? 'Registration failed' : 'Invalid credentials');
    }
  };

  return (
    <div className='login-container'>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <br></br>
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        {error && <p>{error}</p>}
      </form>

      {/* Toggle between login and register */}
      <p>
        {isRegistering
          ? "Login with your account "
          : "Register new account "}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}
