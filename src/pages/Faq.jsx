import { useEffect, useMemo, useState } from 'react';
import Topbar from '../components/Topbar';
import FaqTable from '../components/FaqTable';
import FaqModal from '../components/FaqModal';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useFaqs } from '../context/FaqContext';

const ITEMS_PER_PAGE = 10;

export default function Faq() {
  const { faqs, loading, filteredFaqs, faqFilter, setFaqFilter, saveFaq, removeFaq } = useFaqs();
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

  function handleSearchChange(e) {
    setFaqFilter(e.target.value);
    setCurrentPage(1);
  }

  return (
    <>
      <Topbar
        title="Kelola FAQ"
        description="Ini yang dibaca bot sebelum meneruskan ke manusia — makin lengkap, makin sedikit tiket yang masuk."
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '220px', flexShrink: 0 }}>
          <svg 
            width="15" 
            height="15" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            style={{ position: 'absolute', left: '12px', color: '#6b7280', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Cari FAQ..."
            value={faqFilter}
            onChange={handleSearchChange}
            style={{
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid transparent',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              backgroundColor: '#eef1ec',
              color: '#374151'
            }}
          />
        </div>
      </Topbar>

      <div className="content">
        <div className="faq-toolbar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="faq-count-text" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            {filteredFaqs.length} FAQ terdaftar
          </div>

          <button className="btn-add" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah FAQ
          </button>
        </div>

        <div className="panel">
          <div className="faq-list">
           {loading ? (
              <TableSkeleton rows={6} columns={5} />
            ) : filteredFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 24px', color: '#9ca3af', fontSize: '13px', fontWeight: '400' }}>
                Tidak ada FAQ yang cocok dengan filter ini.
              </div>
            ) : (
              <>
                <FaqTable faqs={paginatedFaqs} onEdit={openEdit} onDelete={removeFaq} />
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
              </>
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
    </>
  );
}