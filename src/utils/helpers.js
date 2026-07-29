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
  return t.status !== 'done' && t.wait >= 120;
}
