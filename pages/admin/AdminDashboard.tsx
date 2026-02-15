import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPeserta, changeStatus } from '../../services/mockService';
import { PesertaData, StatusPeserta } from '../../types';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [pesertaList, setPesertaList] = useState<PesertaData[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaData | null>(null);
  const [catatan, setCatatan] = useState('');
  
  const refreshData = () => {
    const data = getAllPeserta();
    setPesertaList(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredData = pesertaList.filter(p => filterStatus === 'ALL' || p.status === filterStatus);

  const handleStatusChange = (newStatus: StatusPeserta) => {
    if (!selectedPeserta || !user) return;
    
    if (newStatus === StatusPeserta.PERBAIKAN && !catatan.trim()) {
        alert("Wajib mengisi catatan untuk status PERBAIKAN");
        return;
    }

    if (confirm(`Ubah status ke ${newStatus}?`)) {
        changeStatus(selectedPeserta.pesertaid, newStatus, user.username, catatan);
        refreshData();
        setSelectedPeserta(null);
        setCatatan('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800 tracking-tight">Admin<span className="text-blue-600">Panel</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">{user?.username}</span>
              <button onClick={() => logout()} className="text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Pendaftar</h4>
                 <p className="text-3xl font-extrabold text-gray-800">{pesertaList.length}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Submitted</h4>
                 <p className="text-3xl font-extrabold text-blue-600">{pesertaList.filter(p => p.status === StatusPeserta.SUBMITTED).length}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diterima</h4>
                 <p className="text-3xl font-extrabold text-green-600">{pesertaList.filter(p => p.status === StatusPeserta.DITERIMA).length}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Perbaikan</h4>
                 <p className="text-3xl font-extrabold text-yellow-600">{pesertaList.filter(p => p.status === StatusPeserta.PERBAIKAN).length}</p>
             </div>
         </div>

         {/* Filter & Actions */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center space-x-3">
                <span className="text-gray-500 text-sm font-medium">Filter Status:</span>
                <select 
                    value={filterStatus} 
                    onChange={e => setFilterStatus(e.target.value)} 
                    className="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 py-2 pl-3 pr-8"
                >
                    <option value="ALL">Semua Status</option>
                    {Object.values(StatusPeserta).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <div>
                 {/* Placeholder for export buttons */}
                 <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">Export CSV</button>
             </div>
         </div>

         {/* Table */}
         <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NIK</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map(p => (
                            <tr key={p.pesertaid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600 font-bold">{p.koderegis}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{p.nama}</div>
                                    <div className="text-xs text-gray-500">{p.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.nik}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => setSelectedPeserta(p)} 
                                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                                    >
                                        Verifikasi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {filteredData.length === 0 && (
                 <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                     <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                     <p>Data tidak ditemukan</p>
                 </div>
             )}
         </div>
      </main>

      {/* Verification Modal */}
      {selectedPeserta && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setSelectedPeserta(null)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Verifikasi Peserta</h3>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-500">Nama: <span className="font-medium text-gray-900">{selectedPeserta.nama}</span></p>
                                    <p className="text-sm text-gray-500">Kode: <span className="font-mono text-gray-900">{selectedPeserta.koderegis}</span></p>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Wajib jika minta perbaikan)</label>
                                    <textarea 
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-gray-50" 
                                        rows={3}
                                        value={catatan}
                                        onChange={e => setCatatan(e.target.value)}
                                        placeholder="Tulis alasan jika minta perbaikan..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button 
                            type="button" 
                            onClick={() => handleStatusChange(StatusPeserta.DITERIMA)}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:w-auto sm:text-sm"
                        >
                            Terima
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleStatusChange(StatusPeserta.PERBAIKAN)}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none sm:w-auto sm:text-sm"
                        >
                            Minta Perbaikan
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleStatusChange(StatusPeserta.DITOLAK)}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm"
                        >
                            Tolak
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setSelectedPeserta(null)}
                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;