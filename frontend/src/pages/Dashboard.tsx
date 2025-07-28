import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

interface Credential {
  _id?: string;
  category: string;
  accountName: string;
  username: string;
  password: string;
  mpin?: string;
  securityQuestions?: string;
  notes?: string;
}

const emptyForm: Credential = {
  category: '',
  accountName: '',
  username: '',
  password: '',
  mpin: '',
  securityQuestions: '',
  notes: '',
};

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [form, setForm] = useState<Credential>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<{ [id: string]: boolean }>({});
  const [showMasterPrompt, setShowMasterPrompt] = useState<string | null>(null); // credential id
  const [masterPassword, setMasterPassword] = useState('');
  const [masterError, setMasterError] = useState('');

  const fetchCredentials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/credentials', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredentials(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
    // eslint-disable-next-line
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        await axios.put(`/api/credentials/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/credentials', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchCredentials();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save credential');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cred: Credential) => {
    setForm(cred);
    setEditingId(cred._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/credentials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCredentials();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete credential');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPassword = (id: string) => {
    setShowMasterPrompt(id);
    setMasterPassword('');
    setMasterError('');
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMasterError('');
    try {
      // Call backend to verify master password (here, user's password)
      await axios.post('/api/auth/verify-master', { masterPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevealed(r => ({ ...r, [showMasterPrompt!]: true }));
      setShowMasterPrompt(null);
      setMasterPassword('');
    } catch (err: any) {
      setMasterError(err.response?.data?.message || 'Incorrect master password');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username || 'User'}!</h2>
      <button onClick={logout}>Logout</button>
      <h3>Your Credentials</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <ul>
        {credentials.map((cred) => (
          <li key={cred._id} style={{ marginBottom: 12 }}>
            <strong>{cred.accountName}</strong> ({cred.category})<br />
            Username: {cred.username}<br />
            Password: {revealed[cred._id || ''] ? cred.password : '••••••••'}{' '}
            <button onClick={() => handleViewPassword(cred._id!)} disabled={revealed[cred._id || '']}>View</button>
            {cred.mpin && <>MPIN: {cred.mpin}<br /></>}
            {cred.securityQuestions && <>Security Qs: {cred.securityQuestions}<br /></>}
            {cred.notes && <>Notes: {cred.notes}<br /></>}
            <button onClick={() => handleEdit(cred)}>Edit</button>
            <button onClick={() => handleDelete(cred._id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
      {showMasterPrompt && (
        <div className="modal">
          <form onSubmit={handleMasterSubmit} className="master-form">
            <h4>Enter Master Password to View</h4>
            <input
              type="password"
              placeholder="Master Password"
              value={masterPassword}
              onChange={e => setMasterPassword(e.target.value)}
              required
            />
            {masterError && <div className="error">{masterError}</div>}
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowMasterPrompt(null)}>Cancel</button>
          </form>
        </div>
      )}
      <h3>{editingId ? 'Edit' : 'Add'} Credential</h3>
      <form onSubmit={handleSave} className="cred-form">
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Account Name"
          value={form.accountName}
          onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="MPIN (optional)"
          value={form.mpin}
          onChange={e => setForm(f => ({ ...f, mpin: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Security Questions (optional)"
          value={form.securityQuestions}
          onChange={e => setForm(f => ({ ...f, securityQuestions: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        />
        <button type="submit" disabled={loading}>{editingId ? 'Update' : 'Add'} Credential</button>
        {editingId && <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</button>}
      </form>
    </div>
  );
} 