// Enum for Status Flow
export enum StatusPeserta {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PERBAIKAN = 'PERBAIKAN',
  DITERIMA = 'DITERIMA',
  DITOLAK = 'DITOLAK'
}

export enum Role {
  ADMIN = 'ADMIN',
  PESERTA = 'PESERTA'
}

// Sheet USERS
export interface User {
  id: string;
  role: Role;
  username: string; // NIK for Peserta, Username for Admin
  nik?: string; // Optional because Admin might not use NIK in this specific schema context for login
  pesertaid?: string;
  password?: string;
  status: string; // 'ACTIVE' | 'INACTIVE'
  token?: string;
  create: string;
  update: string;
}

// Sheet PESERTA
export interface PesertaData {
  pesertaid: string;
  koderegis: string;
  nik: string;
  nisn: string;
  nama: string;
  jk: 'L' | 'P';
  tempatlahir: string;
  tanggallahir: string;
  email: string;
  nohp: string;
  alamat: string;
  sekolahasal: string;
  namaayah: string;
  tahunlahirayah: string;
  nikayah: string;
  pekerjaanayah: string;
  penghasilanayah: string;
  namaibu: string;
  tahunlahiribu: string;
  nikibu: string;
  pekerjaanibu: string;
  penghasilanibu: string;
  status: StatusPeserta;
  createdat: string;
  updatedat: string;
}

// Sheet NILAI
export interface NilaiData {
  pesertaid: string;
  jalur: string; // 'ZONASI' | 'PRESTASI' | 'AFIRMASI'
  pilihan1: string;
  pilihan2: string;
  pilihan3: string;
  pilihan4: string;
  pilihan5: string;
  pilihan6: string;
  pilihan7: string;
  pilihan8: string;
  pilihan9: string;
  pilihan10: string; // Placeholder as per schema, likely unused based on form requirement
  
  // Semester 1
  s1_ipa: number; s1_ips: number; s1_mtk: number; s1_bindo: number; s1_bing: number;
  // Semester 2
  s2_ipa: number; s2_ips: number; s2_mtk: number; s2_bindo: number; s2_bing: number;
  // Semester 3
  s3_ipa: number; s3_ips: number; s3_mtk: number; s3_bindo: number; s3_bing: number;
  // Semester 4
  s4_ipa: number; s4_ips: number; s4_mtk: number; s4_bindo: number; s4_bing: number;
  // Semester 5
  s5_ipa: number; s5_ips: number; s5_mtk: number; s5_bindo: number; s5_bing: number;

  status: StatusPeserta;
  createdat: string;
  updatedat: string;
}

// Sheet BERKAS
export interface BerkasData {
  pesertaid: string;
  jalur: string;
  rapot1: string; // Base64 or URL
  rapot2: string;
  rapot3: string;
  rapot4: string;
  rapot5: string;
  prestasi1: string;
  prestasi2: string;
  afirmasi: string;
  // NOTE: Schema does not have 'kk', but requirements say: "Wajib rekomendasikan penambahan kolom kk".
  // We will handle 'kk' in the UI logic and strictly map it if the backend allows, 
  // or store it in a temporary local field for this mock. 
  kk?: string; 
  
  status: StatusPeserta;
  createdat: string;
  updatedat: string;
}

// Sheet SETTINGS
export interface Settings {
  lastRunningNumber: number;
  tahun: string;
  gelombang: string;
}

// Sheet LOGS
export interface Log {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

// Sheet STATUS_HISTORY
export interface StatusHistory {
  id: string;
  pesertaid: string;
  old_status: StatusPeserta;
  new_status: StatusPeserta;
  changed_by: string; // Username/NIK
  catatan?: string; // Mandatory if new_status is PERBAIKAN
  timestamp: string;
}

// Aggregated Type for UI
export interface FullPesertaContext {
  peserta: PesertaData;
  nilai: NilaiData;
  berkas: BerkasData;
  history: StatusHistory[];
}
