import { useToastList } from '../context/ToastContext';

export default function ToastContainer() {
  const toasts = useToastList();
  return (
    <div id="toast-wrap">
      {toasts.map((t) => (
        <div className="toast" key={t.id} style={t.leaving ? { opacity: 0, transition: 'opacity .3s' } : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
