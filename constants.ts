export const PEKERJAAN_OPTIONS = [
  { code: '01', label: 'Tidak bekerja' },
  { code: '02', label: 'Nelayan' },
  { code: '03', label: 'Petani' },
  { code: '04', label: 'Peternak' },
  { code: '05', label: 'PNS/TNI/POLRI' },
  { code: '06', label: 'Karyawan Swasta' },
  { code: '07', label: 'Pedagang Kecil' },
  { code: '08', label: 'Pedagang Besar' },
  { code: '09', label: 'Wiraswasta' },
  { code: '10', label: 'Wirausaha' },
  { code: '11', label: 'Buruh' },
  { code: '12', label: 'Pensiunan' },
];

export const PENGHASILAN_OPTIONS = [
  { code: '01', label: '< Rp. 500.000' },
  { code: '02', label: 'Rp. 500.000-Rp.999.999' },
  { code: '03', label: 'Rp. 1.000.000-Rp.1.999.999' },
  { code: '04', label: 'Rp.2.000.000-Rp.4.999.999' },
  { code: '05', label: 'Rp.5.000.000-Rp.20.000.000' },
  { code: '06', label: '> Rp.20.000.000' },
  { code: '07', label: 'Tidak Berpenghasilan' },
];

export const JURUSAN_OPTIONS = [
  { code: 'DPIB', label: 'DESAIN PEMODELAN DAN INFORMASI BANGUNAN (DPIB)' },
  { code: 'PPLG', label: 'PENGEMBANGAN PERANGKAT LUNAK DAN GIM (PPLG)' },
  { code: 'TAB', label: 'TEKNIK ALAT BERAT (TAB)' },
  { code: 'TEI', label: 'TEKNIK ELEKTRONIKA INDUSTRI (TEI)' },
  { code: 'TGP', label: 'TEKNIK GEOLOGI PERTAMBANGAN (TGP)' },
  { code: 'TITL', label: 'TEKNIK INSTALASI TENAGA LISTRIK (TITL)' },
  { code: 'TJKT', label: 'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI (TJKT)' },
  { code: 'TKP', label: 'TEKNIK KONSTRUKSI DAN PERUMAHAN (TKP)' },
  { code: 'TKR', label: 'TEKNIK KENDARAAN RINGAN (TKR)' },
  { code: 'TLAS', label: 'TEKNIK PENGELASAN (TLAS)' },
  { code: 'TP', label: 'TEKNIK PEMESINAN (TP)' },
  { code: 'TSM', label: 'TEKNIK SEPEDA MOTOR (TSM)' },
];

export const APP_CONFIG = {
  TOKEN_EXPIRY_HOURS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
};
