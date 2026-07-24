import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}