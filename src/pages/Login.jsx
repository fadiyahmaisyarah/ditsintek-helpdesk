import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { useToast } from '../context/ToastContext';
import { waitClass, waitLabel } from '../utils/helpers';

export default function Login() {
  const { login, loggingIn } = useAuth();
  const { tickets } = useTickets();
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: false, pass: false });

  const queuePreview = useMemo(() => {
    return [...tickets]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => b.wait - a.wait)
      .slice(0, 3);
  }, [tickets]);

  async function handleLogin() {
    const nextErrors = { username: !username.trim(), pass: !password.trim() };
    setErrors(nextErrors);
    if (nextErrors.username || nextErrors.pass) return;

    try {
      const loggedInUser = await login(username, password);
      
      if (loggedInUser) {
        toast(`Selamat datang kembali, ${username}!`);
        
        // Paksakan role menjadi admin jika username mengandung kata 'admin'
        const isActuallyAdmin = username.toLowerCase().includes('admin') || 
                               (loggedInUser.role && loggedInUser.role.toLowerCase().includes('admin'));

        setTimeout(() => {
          if (isActuallyAdmin) {
            navigate('/accounts', { replace: true }); // Masuk ke Manajemen Akun (Halaman Admin)
          } else {
            navigate('/dashboard', { replace: true }); // Masuk ke Dashboard Helpdesk
          }
        }, 500);
      }
    } catch (err) {
      console.error('Login Error:', err);
      toast(err.message || 'Username atau password salah!');
    }
  }

  return (
    <div id="screen-login" className="screen active">
      <div className="login-visual">
        <div className="login-brand">
          <h1>DITSINTEK Helpdesk</h1>
          <p>
            Dashboard monitoring tiket dari bot Telegram — satu tempat untuk memantau, menjawab,
            dan melacak seluruh keluhan mahasiswa &amp; tenaga didik.
          </p>
        </div>
        <div className="queue-preview">
          <div className="qp-title">Antrean saat ini</div>
          <div>
            {queuePreview.map((t) => {
              const wc = waitClass(t);
              const color = wc === 'urgent' ? '#c9534f' : wc === 'warn' ? '#d3a339' : '#5a9c74';
              return (
                <div className="qp-row" key={t.id}>
                  <span className="qp-dot" style={{ background: color }} />
                  <span className="who">
                    {t.name} — {t.kategori}
                  </span>
                  <span className="wait">{waitLabel(t)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-card">
          <h2>Masuk ke dashboard</h2>
          <p className="sub">
            Silakan masukkan akun Anda untuk melanjutkan.
          </p>
          
          <div className={`field${errors.username ? ' error' : ''}`}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="err-msg">Masukkan username kamu.</div>
          </div>
          <div className={`field${errors.pass ? ' error' : ''}`}>
            <label>Kata sandi</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="err-msg">Kata sandi tidak boleh kosong.</div>
          </div>
          <button className="btn-primary" disabled={loggingIn} onClick={handleLogin}>
            {loggingIn ? 'Memeriksa...' : 'Masuk'}
          </button>
          <div className="login-foot">Lupa kata sandi? Hubungi admin sistem DITSINTEK.</div>
        </div>
      </div>
    </div>
  );
}