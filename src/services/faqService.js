import api from './api';

function mapFaqData(faq) {
  if (!faq) return null;

  return {
    id: faq.id_faq || faq.id,
    cat: faq.category || faq.cat || 'Lainnya',
    q: faq.question || faq.q || '',
    a: faq.answer || faq.a || '',
  };
}

function mapFaqPayload({ cat, q, a }) {
  return {
    question: q,
    answer: a,
    category: cat,
  };
}

export async function getFaqs() {
  try {
    const response = await api.get('/faqs');
    const rawData = response.data?.data || [];
    return Array.isArray(rawData) ? rawData.map(mapFaqData) : [];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function createFaq({ cat, q, a }) {
  const response = await api.post('/faqs', mapFaqPayload({ cat, q, a }));
  return mapFaqData(response.data?.data);
}

export async function updateFaq(id, { cat, q, a }) {
  const response = await api.put(`/faqs/${id}`, mapFaqPayload({ cat, q, a }));
  return mapFaqData(response.data?.data);
}

export async function deleteFaq(id) {
  const response = await api.delete(`/faqs/${id}`);
  return mapFaqData(response.data?.data);
}
