import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [form, setForm] = useState({
    logusername: '',
    logpassword: ''
  });

  const [usernameStatus, setUsernameStatus] = useState('');
  let usernameTimer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    clearTimeout(usernameTimer);
    if (form.logusername.trim() !== '') {
      usernameTimer = setTimeout(async () => {
        try {
          const res = await fetch('/check-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: form.logusername })
          });
          const data = await res.json();
          setUsernameStatus(data.exists ? '' : 'Username does not exist');
        } catch (err) {
          console.error('Username check failed:', err);
        }
      }, 500);
    } else {
      setUsernameStatus('');
    }
    return () => clearTimeout(usernameTimer);
  }, [form.logusername]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="JewelryJinn"
          src={logo}
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-3 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {usernameStatus && (
          <div className="mb-4 rounded-md bg-yellow-100 p-3 text-sm text-yellow-800">
            {usernameStatus}
          </div>
        )}

        <form action="/login-action" method="POST" className="space-y-6">
          <div>
            <label htmlFor="logusername" className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              id="logusername"
              name="logusername"
              type="text"
              required
              value={form.logusername}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="logpassword" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="logpassword"
              name="logpassword"
              type="password"
              required
              value={form.logpassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!!usernameStatus}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}