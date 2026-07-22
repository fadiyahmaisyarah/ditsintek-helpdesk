import { useState } from 'react';
import AppShell from '../components/AppShell';
import Topbar from '../components/Topbar';
import FaqTable from '../components/FaqTable';
import FaqModal from '../components/FaqModal';
import { useFaqs } from '../context/FaqContext';

const CATS = ['all', 'Akademik', 'Non Akademik', 'Lainnya'];

export default function Faq() {
  const { faqs, faqFilter, setFaqFilter, filteredFaqs, saveFaq, removeFaq } = useFaqs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingFaq = editingId ? faqs.find((f) => f.id === editingId) : null;

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
        title="Kelola FAQ"
        description="Ini yang dibaca bot sebelum meneruskan ke manusia — makin lengkap, makin sedikit tiket yang masuk."
      />
      <div className="content">
        <div className="faq-toolbar">
          <div className="filters">
            {CATS.map((c) => (
              <div
                key={c}
                className={`chip${faqFilter === c ? ' on' : ''}`}
                onClick={() => setFaqFilter(c)}
              >
                {c === 'all' ? 'Semua Kategori' : c}
              </div>
            ))}
          </div>
          <button className="btn-add" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah FAQ
          </button>
        </div>
        <div className="panel">
          <div className="faq-list">
            <FaqTable faqs={filteredFaqs} onEdit={openEdit} onDelete={removeFaq} />
          </div>
        </div>
      </div>
      <FaqModal
        open={modalOpen}
        editingFaq={editingFaq}
        onClose={() => setModalOpen(false)}
        onSave={saveFaq}
      />
    </AppShell>
  );
}
