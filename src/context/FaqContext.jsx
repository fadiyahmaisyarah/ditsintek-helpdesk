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
  const [faqFilter, setFaqFilter] = useState('all');

  useEffect(() => {
    getFaqs().then((data) => {
      setFaqs(data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Perbaikan di sini: mendukung filter kategori ATAU pencarian teks bebas (pertanyaan/jawaban/kategori)
  const filteredFaqs = useMemo(() => {
    if (!faqFilter || faqFilter === 'all') {
      return faqs;
    }
    const keyword = faqFilter.toLowerCase();
    
    // Cek apakah faqFilter ini cocok sebagai kategori persis, ATAU mengandung teks di pertanyaan/jawaban/kategori
    return faqs.filter((f) => {
      const matchCat = f.cat && f.cat.toLowerCase() === keyword;
      const matchQuery = 
        (f.q && f.q.toLowerCase().includes(keyword)) ||
        (f.a && f.a.toLowerCase().includes(keyword)) ||
        (f.cat && f.cat.toLowerCase().includes(keyword)) ||
        (f.question && f.question.toLowerCase().includes(keyword)) ||
        (f.answer && f.answer.toLowerCase().includes(keyword));
      
      return matchCat || matchQuery;
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
        setFaqs((prev) => prev.map((f) => (f.id === id ? updated : f)));
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
      setFaqs((prev) => prev.filter((f) => f.id !== deletedId));
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