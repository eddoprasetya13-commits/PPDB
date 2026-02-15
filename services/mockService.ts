import { 
  User, PesertaData, NilaiData, BerkasData, Settings, StatusHistory, 
  Role, StatusPeserta, Log 
} from '../types';
import { APP_CONFIG } from '../constants';

// --- MOCK DATABASE INITIALIZATION ---
const loadFromStorage = <T,>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Mock Data
const DEFAULT_SETTINGS: Settings = {
  lastRunningNumber: 0,
  tahun: '2026',
  gelombang: 'G1'
};

const MOCK_ADMIN: User = {
  id: 'admin-1',
  role: Role.ADMIN,
  username: 'admin',
  password: 'password123',
  status: 'ACTIVE',
  create: new Date().toISOString(),
  update: new Date().toISOString()
};

// --- SERVICE METHODS ---

export const getSettings = (): Settings => loadFromStorage('db_settings', DEFAULT_SETTINGS);

const generateKodeRegis = (settings: Settings): string => {
  const nextNum = settings.lastRunningNumber + 1;
  const padded = nextNum.toString().padStart(6, '0');
  return `PPDB-${settings.tahun}-${settings.gelombang}-${padded}`;
};

export const registerPeserta = (nik: string, nama: string, email: string, password: string): { success: boolean, message: string, user?: User } => {
  const users = loadFromStorage<User[]>('db_users', [MOCK_ADMIN]);
  const pesertaList = loadFromStorage<PesertaData[]>('db_peserta', []);

  if (users.find(u => u.username === nik)) {
    return { success: false, message: 'NIK sudah terdaftar.' };
  }

  const settings = getSettings();
  const kodeRegis = generateKodeRegis(settings);
  
  // Update Settings (Running Number)
  settings.lastRunningNumber += 1;
  saveToStorage('db_settings', settings);

  const pesertaId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Create User Account
  const newUser: User = {
    id: crypto.randomUUID(),
    role: Role.PESERTA,
    username: nik,
    nik: nik,
    pesertaid: pesertaId,
    password: password,
    status: 'ACTIVE',
    create: now,
    update: now
  };

  // Create Peserta Entry
  const newPeserta: PesertaData = {
    pesertaid: pesertaId,
    koderegis: kodeRegis,
    nik: nik,
    nisn: '',
    nama: nama,
    jk: 'L',
    tempatlahir: '',
    tanggallahir: '',
    email: email,
    nohp: '',
    alamat: '',
    sekolahasal: '',
    namaayah: '',
    tahunlahirayah: '',
    nikayah: '',
    pekerjaanayah: '',
    penghasilanayah: '',
    namaibu: '',
    tahunlahiribu: '',
    nikibu: '',
    pekerjaanibu: '',
    penghasilanibu: '',
    status: StatusPeserta.DRAFT,
    createdat: now,
    updatedat: now
  };

  // Create Empty Nilai Entry
  const newNilai: NilaiData = {
    pesertaid: pesertaId,
    jalur: 'ZONASI',
    pilihan1: '', pilihan2: '', pilihan3: '', pilihan4: '', pilihan5: '',
    pilihan6: '', pilihan7: '', pilihan8: '', pilihan9: '', pilihan10: '',
    s1_ipa: 0, s1_ips: 0, s1_mtk: 0, s1_bindo: 0, s1_bing: 0,
    s2_ipa: 0, s2_ips: 0, s2_mtk: 0, s2_bindo: 0, s2_bing: 0,
    s3_ipa: 0, s3_ips: 0, s3_mtk: 0, s3_bindo: 0, s3_bing: 0,
    s4_ipa: 0, s4_ips: 0, s4_mtk: 0, s4_bindo: 0, s4_bing: 0,
    s5_ipa: 0, s5_ips: 0, s5_mtk: 0, s5_bindo: 0, s5_bing: 0,
    status: StatusPeserta.DRAFT,
    createdat: now,
    updatedat: now
  };

  // Create Empty Berkas Entry
  const newBerkas: BerkasData = {
    pesertaid: pesertaId,
    jalur: 'ZONASI',
    rapot1: '', rapot2: '', rapot3: '', rapot4: '', rapot5: '',
    prestasi1: '', prestasi2: '', afirmasi: '', kk: '',
    status: StatusPeserta.DRAFT,
    createdat: now,
    updatedat: now
  };

  saveToStorage('db_users', [...users, newUser]);
  saveToStorage('db_peserta', [...pesertaList, newPeserta]);
  saveToStorage('db_nilai', [...loadFromStorage<NilaiData[]>('db_nilai', []), newNilai]);
  saveToStorage('db_berkas', [...loadFromStorage<BerkasData[]>('db_berkas', []), newBerkas]);

  logActivity(newUser.username, 'REGISTER', `New registration: ${kodeRegis}`);

  return { success: true, message: 'Registrasi berhasil', user: newUser };
};

export const loginUser = (username: string, password: string): { success: boolean, token?: string, user?: User, message: string } => {
  const users = loadFromStorage<User[]>('db_users', [MOCK_ADMIN]);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return { success: false, message: 'Username atau password salah' };

  // Simulate Token (Simple UUID for mock)
  const token = crypto.randomUUID();
  // In real app, store token with expiry. Here we just rely on AuthContext.
  
  logActivity(username, 'LOGIN', 'User logged in');
  return { success: true, token, user, message: 'Login berhasil' };
};

export const getFullPesertaData = (pesertaId: string): { peserta: PesertaData, nilai: NilaiData, berkas: BerkasData, history: StatusHistory[] } | null => {
  const pesertaList = loadFromStorage<PesertaData[]>('db_peserta', []);
  const nilaiList = loadFromStorage<NilaiData[]>('db_nilai', []);
  const berkasList = loadFromStorage<BerkasData[]>('db_berkas', []);
  const historyList = loadFromStorage<StatusHistory[]>('db_status_history', []);

  const peserta = pesertaList.find(p => p.pesertaid === pesertaId);
  const nilai = nilaiList.find(n => n.pesertaid === pesertaId);
  const berkas = berkasList.find(n => n.pesertaid === pesertaId);
  const history = historyList.filter(h => h.pesertaid === pesertaId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!peserta || !nilai || !berkas) return null;

  return { peserta, nilai, berkas, history };
};

export const updatePesertaData = (type: 'PESERTA' | 'NILAI' | 'BERKAS', pesertaId: string, data: any): void => {
  const now = new Date().toISOString();
  if (type === 'PESERTA') {
    const list = loadFromStorage<PesertaData[]>('db_peserta', []);
    const idx = list.findIndex(p => p.pesertaid === pesertaId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedat: now };
      saveToStorage('db_peserta', list);
    }
  } else if (type === 'NILAI') {
    const list = loadFromStorage<NilaiData[]>('db_nilai', []);
    const idx = list.findIndex(p => p.pesertaid === pesertaId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedat: now };
      saveToStorage('db_nilai', list);
    }
  } else if (type === 'BERKAS') {
    const list = loadFromStorage<BerkasData[]>('db_berkas', []);
    const idx = list.findIndex(p => p.pesertaid === pesertaId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedat: now };
      saveToStorage('db_berkas', list);
    }
  }
};

export const changeStatus = (pesertaId: string, newStatus: StatusPeserta, changedBy: string, catatan: string = ''): void => {
  const pesertaList = loadFromStorage<PesertaData[]>('db_peserta', []);
  const pIdx = pesertaList.findIndex(p => p.pesertaid === pesertaId);
  
  if (pIdx === -1) return;

  const oldStatus = pesertaList[pIdx].status;
  pesertaList[pIdx].status = newStatus;
  pesertaList[pIdx].updatedat = new Date().toISOString();
  saveToStorage('db_peserta', pesertaList);

  // Sync status to Nilai and Berkas (as per implied requirement to keep status separate but synced for completeness)
  updatePesertaData('NILAI', pesertaId, { status: newStatus });
  updatePesertaData('BERKAS', pesertaId, { status: newStatus });

  // Add History
  const historyList = loadFromStorage<StatusHistory[]>('db_status_history', []);
  const newHistory: StatusHistory = {
    id: crypto.randomUUID(),
    pesertaid: pesertaId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: changedBy,
    catatan: catatan,
    timestamp: new Date().toISOString()
  };
  saveToStorage('db_status_history', [...historyList, newHistory]);

  logActivity(changedBy, 'STATUS_CHANGE', `Changed ${pesertaId} from ${oldStatus} to ${newStatus}`);
};

export const logActivity = (user: string, action: string, details: string) => {
  const logs = loadFromStorage<Log[]>('db_logs', []);
  const newLog: Log = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user,
    action,
    details
  };
  saveToStorage('db_logs', [...logs, newLog]);
};

export const getAllPeserta = (): PesertaData[] => {
    return loadFromStorage<PesertaData[]>('db_peserta', []);
};
