import NotificationBell from './NotificationBell';

export default function Topbar({ title, description, children }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {description && <div className="desc">{description}</div>}
      </div>
      <div className="topbar-actions">
        {children}
        <NotificationBell />
      </div>
    </div>
  );
}
