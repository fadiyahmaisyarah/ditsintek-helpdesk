import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function BaseSkeleton({ children }) {
  return (
    <SkeletonTheme baseColor="#dfe6dc" highlightColor="#f7faf6">
      {children}
    </SkeletonTheme>
  );
}

function LoadingFrame({ title, subtitle, children }) {
  return (
    <BaseSkeleton>
      <div
        style={{
          minHeight: 'calc(100vh - 72px)',
          padding: '24px 26px 60px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))',
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <Skeleton height={18} width="24%" />
          <div style={{ marginTop: 8 }}>
            <Skeleton height={13} width="42%" />
          </div>
          {title ? (
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-faint)' }}>
              {title}
              {subtitle ? ` — ${subtitle}` : ''}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </BaseSkeleton>
  );
}

export function DashboardSkeleton() {
  return (
    <LoadingFrame title="Memuat antrean tiket" subtitle="Data sedang disinkronkan dari server">
      <div className="content">
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="stat-card" key={index}>
              <Skeleton height={18} width="55%" />
              <div style={{ marginTop: 10 }}>
                <Skeleton height={28} width="40%" />
              </div>
              <div style={{ marginTop: 10 }}>
                <Skeleton height={12} width="70%" />
              </div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ padding: 18 }}>
          <Skeleton height={20} width="28%" />
          <div style={{ marginTop: 16 }}>
            <Skeleton count={8} height={18} style={{ marginBottom: 10 }} />
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function TableSkeleton({ rows = 8, columns = 4 }) {
  return (
    <LoadingFrame title="Memuat daftar data" subtitle="Menunggu respons server">
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-soft)' }}>
          <Skeleton height={18} width="24%" />
        </div>
        <div style={{ padding: 18 }}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: 14,
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: rowIndex === rows - 1 ? 'none' : '1px solid var(--border-soft)',
              }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton key={columnIndex} height={16} width={columnIndex === 0 ? '70%' : '85%'} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </LoadingFrame>
  );
}

export function TicketDetailSkeleton() {
  return (
    <LoadingFrame title="Memuat detail tiket" subtitle="Riwayat dan catatan sedang diambil">
      <div className="content">
        <Skeleton height={14} width="14%" />
        <div className="detail-grid" style={{ marginTop: 12 }}>
          <div className="thread-panel">
            <div className="thread-head">
              <div style={{ width: '100%' }}>
                <Skeleton height={22} width="32%" />
                <div style={{ marginTop: 8 }}>
                  <Skeleton height={14} width="42%" />
                </div>
              </div>
              <Skeleton height={28} width={96} borderRadius={999} />
            </div>

            <div className="thread-body">
              <Skeleton height={44} width="34%" />
              <Skeleton height={120} count={2} style={{ marginTop: 8 }} />
            </div>

            <div className="reply-box">
              <Skeleton height={88} />
              <div className="reply-actions" style={{ marginTop: 12 }}>
                <Skeleton height={14} width="28%" />
                <Skeleton height={36} width={128} borderRadius={8} />
              </div>
            </div>
          </div>

          <div>
            <div className="side-card">
              <Skeleton height={16} width="30%" />
              <div style={{ marginTop: 16 }}>
                <Skeleton count={6} height={18} style={{ marginBottom: 10 }} />
              </div>
            </div>
            <div className="side-card">
              <Skeleton height={16} width="26%" />
              <div style={{ marginTop: 16 }}>
                <Skeleton height={36} />
              </div>
            </div>
            <div className="side-card">
              <Skeleton height={16} width="34%" />
              <div style={{ marginTop: 16 }}>
                <Skeleton height={88} />
                <div style={{ marginTop: 12 }}>
                  <Skeleton height={36} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}