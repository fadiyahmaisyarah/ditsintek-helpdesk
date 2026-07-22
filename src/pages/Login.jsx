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

  const [pendingRole, setPendingRole] = useState('helpdesk');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, pass: false });

  const queuePreview = useMemo(() => {
    return [...tickets]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => b.wait - a.wait)
      .slice(0, 3);
  }, [tickets]);

  async function handleLogin() {
    const nextErrors = { email: !email.trim(), pass: !password.trim() };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.pass) return;

    const user = await login({ email, password, role: pendingRole });
    navigate('/dashboard');
    toast(`Selamat datang kembali, ${user.role === 'admin' ? 'Dian' : 'Reza'}!`);
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
            {pendingRole === 'admin' ? 'Khusus admin FAQ.' : 'Khusus tim Helpdesk DITSINTEK.'}
          </p>
          <div className="role-toggle">
            <button
              type="button"
              className={pendingRole === 'helpdesk' ? 'active' : ''}
              onClick={() => setPendingRole('helpdesk')}
            >
              Helpdesk DITSINTEK
            </button>
            <button
              type="button"
              className={pendingRole === 'admin' ? 'active' : ''}
              onClick={() => setPendingRole('admin')}
            >
              Admin FAQ
            </button>
          </div>
          <div className={`field${errors.email ? ' error' : ''}`}>
            <label>Email</label>
            <input
              type="text"
              placeholder="nama@usu.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="err-msg">Masukkan email kantor kamu.</div>
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
