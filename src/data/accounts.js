// Dummy/mock data untuk akun (Manajemen Akun).
// Bisa diganti dengan fetch/axios ke REST API nanti (lihat src/services/api.js).
const ACCOUNTS = [
  { id: 1, name: 'Dian Pratiwi', email: 'dian.pratiwi@usu.ac.id', role: 'admin', active: true, password: '••••••••' },
  { id: 2, name: 'Reza Firmansyah', email: 'reza.firmansyah@usu.ac.id', role: 'helpdesk', active: true, password: '••••••••' },
  { id: 3, name: 'Aditya Rahman', email: 'aditya.rahman@usu.ac.id', role: 'helpdesk', active: true, password: '••••••••' },
  { id: 4, name: 'Nadia Salsabila', email: 'nadia.salsabila@usu.ac.id', role: 'helpdesk', active: false, password: '••••••••' },
];

export default ACCOUNTS;
