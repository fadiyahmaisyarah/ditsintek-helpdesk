import { useState } from 'react';
import Topbar from '../components/Topbar';
import AccountTable from '../components/AccountTable';
import AccountModal from '../components/AccountModal';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { useAccounts } from '../context/AccountContext';

export default function Accounts() {
  const { user, isAdmin } = useAuth();
  const { accounts, loading, saveAccount, removeAccount } = useAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const isUserAdmin = isAdmin || (user && user.username && user.username.toLowerCase().includes('admin'));

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
    <>
      <Topbar
        title="Manajemen Akun"
        description="Khusus Admin — atur siapa saja yang bisa masuk ke dashboard helpdesk."
      />
      <div className="content">
        {!isUserAdmin ? (
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
              {loading ? (
                <TableSkeleton rows={4} columns={4} />
              ) : (
                <AccountTable accounts={accounts} onEdit={openEdit} onDelete={removeAccount} />
              )}
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
    </>
  );
}