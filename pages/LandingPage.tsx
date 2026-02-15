import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPeserta } from '../services/mockService';
import StatusBadge from '../components/StatusBadge';

const LandingPage: React.FC = () => {
  const [nikCheck, setNikCheck] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const allPeserta = getAllPeserta();
    const found = allPeserta.find(p => p.nik === nikCheck);
    setSearchResult(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">PPDB <span className="text-blue-600">Online</span></span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors">Masuk</Link>
            <Link to="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5">Daftar Sekarang</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-sm font-semibold mb-6 backdrop-blur-sm">
            Tahun Ajaran 2026/2027
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Masa Depanmu <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Dimulai Disini</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-light">
            Platform resmi Penerimaan Peserta Didik Baru Sekolah Negeri. 
            Daftar mudah, pantau transparan.
          </p>
          
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md max-w-lg mx-auto border border-white/20 shadow-2xl">
            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input 
                type="text" 
                value={nikCheck}
                onChange={(e) => setNikCheck(e.target.value)}
                placeholder="Cek status dengan NIK..."
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                required
              />
              <button type="submit" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105">
                Cek
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {searched && (
        <div className="container mx-auto px-4 -mt-10 relative z-20 mb-10">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-800">Hasil Pencarian</h3>
              <button onClick={() => setSearched(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            {searchResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-medium">Nama Peserta</span>
                  <span className="font-bold text-gray-900 text-lg">{searchResult.nama}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-medium">Kode Registrasi</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{searchResult.koderegis}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 font-medium">Status Terkini</span>
                  <StatusBadge status={searchResult.status} />
                </div>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk untuk detail lengkap &rarr;</Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="text-lg font-bold text-gray-800">Data Tidak Ditemukan</h4>
                <p className="text-gray-500">Pastikan NIK yang Anda masukkan sudah benar dan terdaftar.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Alur Pendaftaran</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Buat Akun', desc: 'Daftar menggunakan NIK & Email aktif.' },
                { step: '02', title: 'Isi Formulir', desc: 'Lengkapi data diri, nilai rapor, dan dokumen.' },
                { step: '03', title: 'Verifikasi', desc: 'Admin akan memverifikasi data Anda.' },
                { step: '04', title: 'Pengumuman', desc: 'Cek status kelulusan secara berkala.' },
              ].map((item, idx) => (
                <div key={idx} className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                     {item.step}
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">PPDB Sekolah Negeri</h4>
              <p className="text-sm">Sistem seleksi masuk sekolah negeri yang transparan, akuntabel, dan berkeadilan.</p>
            </div>
            <div>
               <h4 className="text-white font-bold text-lg mb-4">Kontak</h4>
               <p className="text-sm mb-2">Jl. Pendidikan No. 123, Kota Cerdas</p>
               <p className="text-sm mb-2">helpdesk@sekolah.sch.id</p>
               <p className="text-sm">(021) 1234-5678</p>
            </div>
            <div>
               <h4 className="text-white font-bold text-lg mb-4">Tautan</h4>
               <ul className="text-sm space-y-2">
                 <li><a href="#" className="hover:text-white transition-colors">Panduan Pendaftaran</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Jadwal Pelaksanaan</a></li>
               </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            &copy; 2026 PPDB Sekolah Negeri. Production Ready System.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;