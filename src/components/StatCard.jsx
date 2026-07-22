export default function StatCard({ n, label, variant }) {
  return (
    <div className={`stat-card${variant ? ` ${variant}` : ''}`}>
      <div className="n">{n}</div>
      <div className="l">{label}</div>
    </div>
  );
}
