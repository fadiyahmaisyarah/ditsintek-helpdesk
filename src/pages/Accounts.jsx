import { useState } from 'react';
import AppShell from '../components/AppShell';
import Topbar from '../components/Topbar';
import AccountTable from '../components/AccountTable';
import AccountModal from '../components/AccountModal';
import { useAuth } from '../context/AuthContext';
import { useAccounts } from '../context/AccountContext';

export default function Accounts() {
  const { isAdmin } = useAuth();
  const { accounts, saveAccount, removeAccount } = useAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingAccount = editingId ? accounts.find((a) => a.id === editingId) : null;

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(id) {
    setEditingId(id);
    setModalOpen(true);
  }

  return (
    <AppShell>
      <Topbar
        title="Manajemen Akun"
        description="Khusus Admin — atur siapa saja yang bisa masuk ke dashboard helpdesk."
      />
      <div className="content">
        {!isAdmin ? (
          <div className="faq-empty">
            Halaman ini khusus untuk Admin. Akun Helpdesk tidak memiliki akses ke Manajemen Akun.
          </div>
        ) : (
          <>
            <div className="faq-toolbar">
              <div className="desc" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                {accounts.length} akun terdaftar
              </div>
              <button className="btn-add" onClick={openAdd}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Tambah Akun
              </button>
            </div>
            <div className="panel">
              <AccountTable accounts={accounts} onEdit={openEdit} onDelete={removeAccount} />
            </div>
          </>
        )}
      </div>
      <AccountModal
        open={modalOpen}
        editingAccount={editingAccount}
        onClose={() => setModalOpen(false)}
        onSave={saveAccount}
      />
    </AppShell>
  );
}
