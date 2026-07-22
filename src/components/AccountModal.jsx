import { useEffect, useState } from 'react';
import Modal from './Modal';

const EMPTY = { name: '', email: '', role: 'helpdesk', password: '' };

export default function AccountModal({ open, editingAccount, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (open) {
      setShowPass(false);
      setForm(
        editingAccount
          ? { name: editingAccount.name, email: editingAccount.email, role: editingAccount.role, password: '' }
          : EMPTY
      );
    }
  }, [open, editingAccount]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    const ok = await onSave(editingAccount ? editingAccount.id : null, form);
    if (ok) onClose();
  }

  const passLabel = editingAccount ? 'Kata Sandi Baru (opsional)' : 'Kata Sandi';
  const passHint = editingAccount
    ? 'Kosongkan kalau tidak ingin mengubah kata sandi akun ini.'
    : 'Akun akan pakai kata sandi ini untuk login pertama kali.';
  const passPlaceholder = editingAccount ? 'Kosongkan jika tidak ingin mengubah' : 'Minimal 8 karakter';

  return (
    <Modal open={open} onClose={onClose} title={editingAccount ? 'Edit Akun' : 'Tambah Akun'}>
      <div className="field">
        <label>Nama</label>
        <input
          placeholder="Nama lengkap"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>Email</label>
        <input
          placeholder="nama@usu.ac.id"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>{passLabel}</label>
        <div className="pw-wrap">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder={passPlaceholder}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <button
            type="button"
            className="pw-toggle"
            title="Tampilkan/sembunyikan kata sandi"
            onClick={() => setShowPass((s) => !s)}
          >
            {showPass ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.4 5.3A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.4 6.4A17.9 17.9 0 0 0 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <div className="hint">{passHint}</div>
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>Peran</label>
        <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
          <option value="admin">Admin</option>
          <option value="helpdesk">Helpdesk</option>
        </select>
      </div>
      <div className="modal-actions">
        <button className="btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button className="btn-send" onClick={handleSave}>
          Simpan Akun
        </button>
      </div>
    </Modal>
  );
}
