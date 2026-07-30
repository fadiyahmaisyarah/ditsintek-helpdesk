export default function FaqTable({ faqs, onEdit, onDelete }) {
  if (!faqs.length) {
    return (
      <div className="faq-empty">
        Belum ada FAQ di kategori ini. Tambahkan supaya bot bisa langsung menjawab pertanyaan
        sejenis.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: 64 }}>ID</th>
          <th style={{ width: 120 }}>Kategori</th>
          <th>Pertanyaan</th>
          <th>Jawaban</th>
          <th style={{ width: 80 }}>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {faqs.map((f) => (
          <tr key={f.id}>
            <td className="id-cell">FAQ-{String(f.id).padStart(3, '0')}</td>
            <td>
              <span className="cat-badge">{f.cat}</span>
            </td>
            <td className="q-cell">{f.q}</td>
            <td className="a-cell">{f.a}</td>
            <td>
              <div className="faq-actions">
                <div className="icon-btn" onClick={() => onEdit(f.id)} title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </div>
                <div className="icon-btn danger" onClick={() => onDelete(f.id)} title="Hapus">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
