import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import Topbar from '../components/Topbar';
import FaqTable from '../components/FaqTable';
import FaqModal from '../components/FaqModal';
import { useFaqs } from '../context/FaqContext';

const ITEMS_PER_PAGE = 10;

export default function Faq() {
  const { faqs, faqFilter, setFaqFilter, filteredFaqs, saveFaq, removeFaq } = useFaqs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const editingFaq = editingId ? faqs.find((f) => f.id === editingId) : null;
  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  const paginatedFaqs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFaqs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFaqs, currentPage]);

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(id) {
    setEditingId(id);
    setModalOpen(true);
  }

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return (
    <AppShell>
      {/* Kotak search dipindah ke sini (di dalam Topbar) sebelah kanan */}
      <Topbar
        title="Kelola FAQ"
        description="Ini yang dibaca bot sebelum meneruskan ke manusia — makin lengkap, makin sedikit tiket yang masuk."
      >
        <input
          type="text"
          placeholder="Cari FAQ..."
          value={faqFilter || ''}
          onChange={(e) => setFaqFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '13px',
            outline: 'none',
            minWidth: '200px',
            backgroundColor: '#fff'
          }}
        />
      </Topbar>

      <div className="content">
        <div className="faq-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {/* Teks counter jumlah FAQ terdaftar */}
          <div className="faq-count-text" style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>
            {filteredFaqs.length} FAQ terdaftar
          </div>

          {/* Tombol Tambah FAQ saja yang tertinggal di bawah */}
          <button className="btn-add" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah FAQ
          </button>
        </div>

        <div className="panel">
          <div className="faq-list">
            <FaqTable faqs={paginatedFaqs} onEdit={openEdit} onDelete={removeFaq} />
            {filteredFaqs.length > 0 && (
              <div className="faq-pagination-wrap">
                <div className="faq-pagination" role="navigation" aria-label="Pagination FAQ">
                  <button className="page-nav-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Prev
                  </button>

                  {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`page-number-btn${page === currentPage ? ' active' : ''}`}
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button className="page-nav-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
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