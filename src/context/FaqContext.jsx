import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createFaq as createFaqRequest,
  deleteFaq as deleteFaqRequest,
  getFaqs,
  updateFaq as updateFaqRequest,
} from '../services/faqService';
import { useToast } from './ToastContext';

const FaqContext = createContext(null);

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export function FaqProvider({ children }) {
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqFilter, setFaqFilter] = useState('');

  // Mengambil data FAQ dari database backend saat pertama kali dibuka
  useEffect(() => {
    getFaqs()
      .then((data) => {
        // Mendukung berbagai format struktur data dari API backend
        const list = Array.isArray(data) ? data : data?.data || [];
        setFaqs(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Logika pencarian real-time persis seperti halaman Antrean Tiket
  const filteredFaqs = useMemo(() => {
    if (!faqFilter || faqFilter.trim() === '' || faqFilter === 'all') {
      return faqs;
    }
    const keyword = faqFilter.toLowerCase();
    
    return faqs.filter((f) => {
      const qText = f.q || f.question || f.pertanyaan || '';
      const aText = f.a || f.answer || f.jawaban || '';
      const cText = f.cat || f.category || f.kategori || '';

      return (
        qText.toLowerCase().includes(keyword) ||
        aText.toLowerCase().includes(keyword) ||
        cText.toLowerCase().includes(keyword)
      );
    });
  }, [faqs, faqFilter]);

  async function saveFaq(id, { cat, q, a }) {
    if (!q.trim() || !a.trim()) {
      toast('Isi pertanyaan dan jawaban dulu ya');
      return false;
    }
    try {
      if (id) {
        const updated = await updateFaqRequest(id, { cat, q: q.trim(), a: a.trim() });
        if (!updated?.id) {
          toast('Gagal memperbarui FAQ');
          return false;
        }
        setFaqs((prev) => prev.map((item) => (item.id === id ? updated : item)));
        toast('FAQ berhasil diperbarui');
      } else {
        const created = await createFaqRequest({ cat, q: q.trim(), a: a.trim() });
        if (!created?.id) {
          toast('Gagal menambahkan FAQ');
          return false;
        }
        setFaqs((prev) => [created, ...prev]);
        toast('FAQ baru ditambahkan');
      }
      return true;
    } catch (error) {
      toast(getErrorMessage(error, 'Gagal menyimpan FAQ'));
      return false;
    }
  }

  async function removeFaq(id) {
    try {
      const deleted = await deleteFaqRequest(id);
      const deletedId = deleted?.id || id;
      setFaqs((prev) => prev.filter((item) => item.id !== deletedId));
      toast('FAQ dihapus');
    } catch (error) {
      toast(getErrorMessage(error, 'Gagal menghapus FAQ'));
    }
  }

  const value = { faqs, loading, faqFilter, setFaqFilter, filteredFaqs, saveFaq, removeFaq };

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
}

export function useFaqs() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error('useFaqs harus dipakai di dalam FaqProvider');
  return ctx;
}