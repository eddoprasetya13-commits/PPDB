import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerPeserta } from '../services/mockService';
import Input from '../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password konfirmasi tidak cocok');
      return;
    }

    setLoading(true);

    setTimeout(() => {
        const res = registerPeserta(formData.nik, formData.nama, formData.email, formData.password);
        setLoading(false);
        if (res.success) {
            setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(res.message);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-200/30 rounded-full blur-[100px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/20 relative z-10">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
             Isi data diri dengan benar untuk memulai pendaftaran
          </p>
        </div>
        
        {success ? (
             <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded-r shadow-md text-center">
                 <div className="text-4xl mb-2">✅</div>
                 <h3 className="font-bold text-lg">Sukses!</h3>
                 <p>{success}</p>
             </div>
        ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm">
                    {error}
                </div>
            )}
            
            <Input label="NIK (Nomor Induk Kependudukan)" name="nik" value={formData.nik} onChange={handleChange} required maxLength={16} placeholder="16 digit angka" />
            <Input label="Nama Lengkap Sesuai Ijazah" name="nama" value={formData.nama} onChange={handleChange} required placeholder="Nama Lengkap" />
            <Input label="Email Aktif" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="contoh@email.com" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Minimal 6 karakter" />
                <Input label="Konfirmasi Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Ulangi password" />
            </div>

            <div className="pt-4">
                <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 shadow-lg shadow-green-600/30 transition-all transform hover:-translate-y-0.5"
                >
                {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
                </button>
            </div>
            </form>
        )}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Masuk disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;