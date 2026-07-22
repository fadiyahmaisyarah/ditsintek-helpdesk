import FAQS from '../data/faqs';
// import api from './api';

let _faqs = FAQS;

export function getFaqs() {
  // return api.get('/faqs').then(res => res.data);
  return Promise.resolve(_faqs);
}

export function createFaq({ cat, q, a }) {
  // return api.post('/faqs', { cat, q, a }).then(res => res.data);
  const newId = Math.max(0, ..._faqs.map((f) => f.id)) + 1;
  const newFaq = { id: newId, cat, q, a };
  _faqs = [newFaq, ..._faqs];
  return Promise.resolve(newFaq);
}

export function updateFaq(id, { cat, q, a }) {
  // return api.put(`/faqs/${id}`, { cat, q, a }).then(res => res.data);
  _faqs = _faqs.map((f) => (f.id === id ? { ...f, cat, q, a } : f));
  return Promise.resolve(_faqs.find((f) => f.id === id));
}

export function deleteFaq(id) {
  // return api.delete(`/faqs/${id}`);
  _faqs = _faqs.filter((f) => f.id !== id);
  return Promise.resolve(true);
}
