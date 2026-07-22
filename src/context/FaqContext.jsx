import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createFaq as createFaqRequest,
  deleteFaq as deleteFaqRequest,
  getFaqs,
  updateFaq as updateFaqRequest,
} from '../services/faqService';
import { useToast } from './ToastContext';

const FaqContext = createContext(null);

export function FaqProvider({ children }) {
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqFilter, setFaqFilter] = useState('all');

  useEffect(() => {
    getFaqs().then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  const filteredFaqs = useMemo(
    () => faqs.filter((f) => faqFilter === 'all' || f.cat === faqFilter),
    [faqs, faqFilter]
  );

  async function saveFaq(id, { cat, q, a }) {
    if (!q.trim() || !a.trim()) {
      toast('Isi pertanyaan dan jawaban dulu ya');
      return false;
    }
    if (id) {
      const updated = await updateFaqRequest(id, { cat, q: q.trim(), a: a.trim() });
      setFaqs((prev) => prev.map((f) => (f.id === id ? updated : f)));
      toast('FAQ berhasil diperbarui');
    } else {
      const created = await createFaqRequest({ cat, q: q.trim(), a: a.trim() });
      setFaqs((prev) => [created, ...prev]);
      toast('FAQ baru ditambahkan');
    }
    return true;
  }

  async function removeFaq(id) {
    await deleteFaqRequest(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast('FAQ dihapus');
  }

  const value = { faqs, loading, faqFilter, setFaqFilter, filteredFaqs, saveFaq, removeFaq };

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
}

export function useFaqs() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error('useFaqs harus dipakai di dalam FaqProvider');
  return ctx;
}
