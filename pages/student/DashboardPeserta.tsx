import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFullPesertaData } from '../../services/mockService';
import { FullPesertaContext, StatusPeserta } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const DashboardPeserta: React.FC = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState<FullPesertaContext | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.pesertaid) {
      const fullData = getFullPesertaData(user.pesertaid);
      setData(fullData);
    }
  }, [user]);

  if (!data) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-blue-600 font-bold">Memuat Data...</div>
      </div>
  );

  const isEditable = data.peserta.status === StatusPeserta.DRAFT || data.peserta.status === StatusPeserta.PERBAIKAN;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded mr-2">
                 <span className="text-white font-bold text-xs">PPDB</span>
              </div>
              <span className="text-lg font-bold text-gray-800">Dashboard Siswa</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.username}</div>
                  <div className="text-xs text-gray-500">Peserta</div>
              </div>
              <button onClick={() => logout()} className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Halo, {data.peserta.nama || 'Calon Siswa'}! 👋</h1>
            <p className="text-gray-600 mt-1">Pantau status pendaftaran dan lengkapi berkasmu disini.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Status Card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold opacity-90">Status Pendaftaran</h2>
                                <p className="text-3xl font-bold mt-2 tracking-wide">{data.peserta.status}</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Kode Registrasi</p>
                                <p className="text-xl font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded mt-1 inline-block">{data.peserta.koderegis}</p>
                            </div>
                        </div>
                        
                        {isEditable ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                                <p className="text-blue-800 mb-4">
                                    {data.peserta.status === StatusPeserta.PERBAIKAN 
                                        ? 'Data Anda perlu perbaikan. Silakan cek catatan dan update formulir.' 
                                        : 'Segera lengkapi formulir pendaftaran Anda untuk diproses.'}
                                </p>
                                <button 
                                    onClick={() => navigate('/form-ppdb')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1"
                                >
                                    {data.peserta.status === StatusPeserta.PERBAIKAN ? 'Perbaiki Data Sekarang' : 'Isi Formulir Pendaftaran'} &rarr;
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="text-green-800 font-medium">Data telah berhasil dikirim.</span>
                                </div>
                                <button onClick={() => navigate('/form-ppdb')} className="text-blue-600 font-bold text-sm hover:underline">Lihat Detail</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info Grid (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                         <p className="text-sm text-gray-500 mb-1">Jalur Pendaftaran</p>
                         <p className="font-semibold text-gray-800">{data.nilai.jalur}</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                         <p className="text-sm text-gray-500 mb-1">Tanggal Daftar</p>
                         <p className="font-semibold text-gray-800">{new Date(data.peserta.createdat).toLocaleDateString('id-ID')}</p>
                     </div>
                </div>
            </div>

            {/* History Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Riwayat Aktivitas</h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                        {data.history.length === 0 ? (
                            <div className="text-center text-gray-400 py-10 italic">Belum ada riwayat.</div>
                        ) : (
                            data.history.map((hist, idx) => (
                                <div key={hist.id} className="relative pl-8">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 font-mono">
                                            {new Date(hist.timestamp).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            Status: <span className={`${idx === 0 ? 'text-blue-600' : 'text-gray-600'}`}>{hist.new_status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Diupdate oleh: {hist.changed_by}
                                        </p>
                                        {hist.catatan && (
                                            <div className="mt-2 text-xs bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
                                                <strong>Catatan:</strong> {hist.catatan}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPeserta;