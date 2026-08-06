export function normalizeTicketStatus(status) {
  const normalized = String(status || '').toLowerCase().trim();
  if (['open', 'new', 'baru'].includes(normalized)) return 'open';
  if (['in_progress', 'progress', 'diproses', 'processing'].includes(normalized)) return 'progress';
  if (['resolved', 'done', 'selesai', 'complete', 'closed', 'close'].includes(normalized)) return 'resolved';
  return 'open';
}

export function isTerminalStatus(status) {
  const normalized = normalizeTicketStatus(status);
  return normalized === 'resolved';
}

export function waitLabel(t) {
  if (isTerminalStatus(t?.status)) return 'Selesai';
  const h = Math.floor(t.wait / 60);
  const m = t.wait % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

export function waitClass(t) {
  if (isTerminalStatus(t?.status)) return 'ok';
  if (t.wait >= 120) return 'urgent';
  if (t.wait >= 45) return 'warn';
  return 'ok';
}

export function waitPct(t) {
  if (isTerminalStatus(t?.status)) return 6;
  return Math.min(100, Math.round((t.wait / 180) * 100));
}

export function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatRelativeDuration(startValue) {
  if (!startValue) return '—';

  const startDate = new Date(startValue);
  if (Number.isNaN(startDate.getTime())) return '—';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60)));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}j`;
  return `${hours}j ${minutes}m`;
}

export function statusLabel(s) {
  const normalized = normalizeTicketStatus(s);
  if (normalized === 'open') return 'Open';
  if (normalized === 'progress') return 'In Progress';
  if (normalized === 'resolved') return 'Resolved';
  return 'Open';
}

export function statusBadgeClass(s) {
  const normalized = normalizeTicketStatus(s);
  if (normalized === 'open') return 'new';
  if (normalized === 'progress') return 'progress';
  if (normalized === 'resolved') return 'resolved';
  return 'new';
}

export function normalizeRoleKey(r) {
  if (!r) return 'mhs';

  const normalized = String(r).toLowerCase().trim();
  if (['dosen', 'staff', 'pegawai', 'teacher'].some((value) => normalized.includes(value))) {
    return 'dosen';
  }
  if (['tendik', 'tenaga'].some((value) => normalized.includes(value))) {
    return 'tendik';
  }
  if (['mhs', 'mahasiswa', 'student', 'pelajar'].some((value) => normalized.includes(value))) {
    return 'mhs';
  }
  return normalized === 'admin' ? 'admin' : 'mhs';
}

export function roleLabel(r) {
  const normalized = normalizeRoleKey(r);
  if (normalized === 'tendik') return 'Tendik';
  if (normalized === 'dosen') return 'Dosen';
  if (normalized === 'admin') return 'Admin';
  return 'Mahasiswa';
}

export function accRoleLabel(r) {
  return r === 'admin' ? 'Admin' : 'Helpdesk';
}

export function isUrgent(t) {
  return !isTerminalStatus(t?.status) && t.wait >= 120;
}