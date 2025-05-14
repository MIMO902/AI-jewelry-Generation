import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function SignUpPage() {
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="JewelryJinn" src={logo} className="mx-auto h-16 w-auto" />
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create a new Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
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
        <form action="/signup-action" method="POST" onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-900">First Name</label>
              <input id="firstname" name="firstname" type="text" required value={form.firstname} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-900">Last Name</label>
              <input id="lastname" name="lastname" type="text" required value={form.lastname} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
            <input id="username" name="username" type="text" required value={form.username} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
            {usernameStatus && <p className="text-sm text-red-600 mt-1">{usernameStatus}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
            {emailStatus && <p className="text-sm text-red-600 mt-1">{emailStatus}</p>}
          </div>

          <input type="hidden" name="type" value="user" />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm" />
          </div>

          <button type="submit" disabled={!!usernameStatus || !!emailStatus} className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Log in</a>
        </p>
      </div>
    </div>
  );
}