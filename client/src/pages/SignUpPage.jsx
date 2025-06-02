import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SignupPage = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get('error');

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [usernameStatus, setUsernameStatus] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [matchError, setMatchError] = useState('');

  let usernameTimer;
  let emailTimer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    clearTimeout(usernameTimer);
    if (form.username.trim() !== '') {
      usernameTimer = setTimeout(async () => {
        const res = await fetch('/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username })
        });
        const data = await res.json();
        setUsernameStatus(data.exists ? 'Username already taken' : '');
      }, 500);
    } else {
      setUsernameStatus('');
    }
    return () => clearTimeout(usernameTimer);
  }, [form.username]);

  useEffect(() => {
    clearTimeout(emailTimer);
    if (form.email.trim() !== '') {
      emailTimer = setTimeout(async () => {
        const res = await fetch('/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email })
        });
        const data = await res.json();
        setEmailStatus(data.exists ? 'Email already exists' : '');
      }, 500);
    } else {
      setEmailStatus('');
    }
    return () => clearTimeout(emailTimer);
  }, [form.email]);

  const handleSubmit = (e) => {
    if (form.password !== form.confirmPassword) {
      e.preventDefault();
      setMatchError('Passwords do not match');
    } else {
      setMatchError('');
    }
  };

  return (
    <StyledWrapper>
      <div className="page-center">
        <div className="container">
          <div className="signup-box">
            <h2>Sign Up</h2>
            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {decodeURIComponent(error)}
              </div>
            )}
            {matchError && (
              <div className="mb-4 rounded-md bg-yellow-100 p-3 text-sm text-yellow-800">
                {matchError}
              </div>
            )}
            <form action="/signup-action" method="POST" onSubmit={handleSubmit}>
              <div className="input-box">
                <input id="firstname" name="firstname" type="text" required value={form.firstname} onChange={handleChange} placeholder="First Name" />
                <label htmlFor="firstname">First Name</label>
              </div>
              <div className="input-box">
                <input id="lastname" name="lastname" type="text" required value={form.lastname} onChange={handleChange} placeholder="Last Name" />
                <label htmlFor="lastname">Last Name</label>
              </div>
              <div className="input-box">
                <input id="username" name="username" type="text" required value={form.username} onChange={handleChange} placeholder="Username" />
                <label htmlFor="username">Username</label>
                {usernameStatus && <p className="text-sm text-red-600 mt-1">{usernameStatus}</p>}
              </div>
              <div className="input-box">
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email" />
                <label htmlFor="email">Email</label>
                {emailStatus && <p className="text-sm text-red-600 mt-1">{emailStatus}</p>}
              </div>
              <input type="hidden" name="type" value="user" />
              <div className="input-box">
                <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Password" />
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-box">
                <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <button className="btn" disabled={!!usernameStatus || !!emailStatus} type="submit">Create Account</button>
              <div className="login-link">
                <Link to="/login">Already have an account? Login</Link>
              </div>
            </form>
          </div>
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} style={{ '--i': i }} />
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  .page-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
  }

  .container {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    background: #000;
    border: 2px solid black;
  }

  .container span {
    position: absolute;
    left: 0;
    width: 32px;
    height: 6px;
    background: #444;
    border-radius: 80px;
    transform-origin: 250px;
    transform: rotate(calc(var(--i) * (360deg / 50)));
    animation: blink 3s linear infinite;
    animation-delay: calc(var(--i) * (3s / 50));
  }

  @keyframes blink {
    0% { background: #b8860b; }
    25% { background: #444; }
  }

  .signup-box {
    position: absolute;
    width: 320px;
    height: 320px;
    padding: 25px;
    border-radius: 50%;
    background-color: #000;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
  }

  h2 {
    font-size: 1.6em;
    color: #b8860b;
    text-align: center;
    margin-bottom: 10px;
  }

  .input-box {
    position: relative;
    margin: 8px 0;
  }

  input {
    width: 100%;
    height: 42px;
    background: transparent;
    border: 2px solid #b8860b;
    outline: none;
    border-radius: 40px;
    font-size: 1em;
    color: #b8860b;
    padding: 0 15px;
    transition: 0.5s ease;
  }

  input::placeholder {
    color: #b8860b;
    opacity: 0.7;
  }

  input:focus {
    border-color: #b8860b;
  }

  input:valid ~ label,
  input:focus ~ label {
    top: -10px;
    font-size: 0.8em;
    background: #000;
    padding: 0 6px;
    color: #b8860b;
  }

  label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    font-size: 1em;
    pointer-events: none;
    transition: 0.5s ease;
    color: #b8860b;
  }

  .btn {
    width: 100%;
    height: 45px;
    background: #b8860b;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 1em;
    color: #000;
    font-weight: 600;
    margin-top: 10px;
  }

  .login-link {
    margin-top: 10px;
    text-align: center;
  }

  .login-link a {
    font-size: 0.95em;
    color: #b8860b;
    text-decoration: none;
    font-weight: 600;
  }
`;

export default SignupPage;
