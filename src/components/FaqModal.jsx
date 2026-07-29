import { useEffect, useState } from 'react';
import Modal from './Modal';

const EMPTY = { cat: 'Akademik', q: '', a: '' };

export default function FaqModal({ open, editingFaq, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(editingFaq ? { cat: editingFaq.cat, q: editingFaq.q, a: editingFaq.a } : EMPTY);
    }
  }, [open, editingFaq]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    const ok = await onSave(editingFaq ? editingFaq.id : null, form);
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}>
      <div className="field">
        <label>Kategori</label>
        <input
          type="text"
          placeholder="Contoh: Bagaimana cara reset password SIA?"
          value={form.cat}
          onChange={(e) => handleChange('cat', e.target.value)}
        />
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>Pertanyaan</label>
        <textarea
          placeholder="Contoh: Bagaimana cara reset password SIA?"
          value={form.q}
          onChange={(e) => handleChange('q', e.target.value)}
        />
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <label>Jawaban</label>
        <textarea
          placeholder="Jawaban yang akan dikirim bot..."
          value={form.a}
          onChange={(e) => handleChange('a', e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button className="btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button className="btn-send" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan FAQ'}
        </button>
      </div>
    </Modal>
  );
}
