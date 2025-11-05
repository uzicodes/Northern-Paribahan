import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.ts';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  }

  return (
    <section className="max-w-md mx-auto py-8">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create account</button>
      </form>
    </section>
  );
}

