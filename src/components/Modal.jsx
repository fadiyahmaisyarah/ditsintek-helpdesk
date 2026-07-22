export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
