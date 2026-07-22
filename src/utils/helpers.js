export function waitLabel(t) {
  if (t.status === 'done') return 'Selesai';
  const h = Math.floor(t.wait / 60);
  const m = t.wait % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

export function waitClass(t) {
  if (t.status === 'done') return 'ok';
  if (t.wait >= 120) return 'urgent';
  if (t.wait >= 45) return 'warn';
  return 'ok';
}

export function waitPct(t) {
  if (t.status === 'done') return 6;
  return Math.min(100, Math.round((t.wait / 180) * 100));
}

export function statusLabel(s) {
  return s === 'new' ? 'Baru' : s === 'progress' ? 'Diproses' : 'Selesai';
}

export function roleLabel(r) {
  return r === 'mhs' ? 'Mahasiswa' : 'Tenaga Didik';
}

export function accRoleLabel(r) {
  return r === 'admin' ? 'Admin' : 'Helpdesk';
}

export function isUrgent(t) {
  return t.status !== 'done' && t.wait >= 120;
}
