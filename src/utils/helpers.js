export function normalizeTicketStatus(status) {
  const normalized = String(status || '').toLowerCase().trim();
  if (['open', 'new', 'baru'].includes(normalized)) return 'open';
  if (['in_progress', 'progress', 'diproses', 'processing'].includes(normalized)) return 'progress';
  if (['resolved', 'done', 'selesai', 'complete'].includes(normalized)) return 'resolved';
  if (['closed', 'close'].includes(normalized)) return 'closed';
  return 'open';
}

export function isTerminalStatus(status) {
  const normalized = normalizeTicketStatus(status);
  return normalized === 'resolved' || normalized === 'closed';
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

export function statusLabel(s) {
  const normalized = normalizeTicketStatus(s);
  if (normalized === 'open') return 'Open';
  if (normalized === 'progress') return 'In Progress';
  if (normalized === 'resolved') return 'Resolved';
  if (normalized === 'closed') return 'Closed';
  return 'Open';
}

export function statusBadgeClass(s) {
  const normalized = normalizeTicketStatus(s);
  if (normalized === 'open') return 'new';
  if (normalized === 'progress') return 'progress';
  if (normalized === 'resolved') return 'resolved';
  if (normalized === 'closed') return 'closed';
  return 'new';
}

export function normalizeRoleKey(r) {
  if (!r) return 'mhs';

  const normalized = String(r).toLowerCase().trim();
  if (['tendik', 'tenaga', 'staff', 'dosen', 'pegawai', 'teacher'].some((value) => normalized.includes(value))) {
    return 'tendik';
  }
  if (['mhs', 'mahasiswa', 'student', 'pelajar'].some((value) => normalized.includes(value))) {
    return 'mhs';
  }
  return normalized === 'admin' ? 'admin' : 'mhs';
}

export function roleLabel(r) {
  const normalized = normalizeRoleKey(r);
  if (normalized === 'tendik') return 'Tenaga Didik';
  if (normalized === 'admin') return 'Admin';
  return 'Mahasiswa';
}

export function accRoleLabel(r) {
  return r === 'admin' ? 'Admin' : 'Helpdesk';
}

export function isUrgent(t) {
  return !isTerminalStatus(t?.status) && t.wait >= 120;
}
