import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFullPesertaData, updatePesertaData, changeStatus } from '../../services/mockService';
import { FullPesertaContext, StatusPeserta, PesertaData, NilaiData, BerkasData } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { PEKERJAAN_OPTIONS, PENGHASILAN_OPTIONS, JURUSAN_OPTIONS } from '../../constants';

const STEPS = ['Data Diri', 'Orang Tua', 'Nilai', 'Berkas', 'Selesai'];

const FormPeserta: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FullPesertaContext | null>(null);
  
  // Local state for edits
  const [pesertaForm, setPesertaForm] = useState<Partial<PesertaData>>({});
  const [nilaiForm, setNilaiForm] = useState<Partial<NilaiData>>({});
  const [berkasForm, setBerkasForm] = useState<Partial<BerkasData>>({});

  useEffect(() => {
    if (user && user.pesertaid) {
      const fullData = getFullPesertaData(user.pesertaid);
      if (fullData) {
        setData(fullData);
        setPesertaForm(fullData.peserta);
        setNilaiForm(fullData.nilai);
        setBerkasForm(fullData.berkas);
      }
      setLoading(false);
    }
  }, [user]);

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  const isReadOnly = !(data.peserta.status === StatusPeserta.DRAFT || data.peserta.status === StatusPeserta.PERBAIKAN);

  const handlePesertaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPesertaForm({ ...pesertaForm, [e.target.name]: e.target.value });
  };

  const handleNilaiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setNilaiForm({ ...nilaiForm, [e.target.name]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof BerkasData) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       setBerkasForm({ ...berkasForm, [field]: `Uploaded: ${file.name}` });
    }
  };

  const saveData = (currentStep: number) => {
    if (!user?.pesertaid) return;
    if (isReadOnly) return;

    if (currentStep === 1 || currentStep === 2) {
      updatePesertaData('PESERTA', user.pesertaid, pesertaForm);
    } else if (currentStep === 3) {
      updatePesertaData('NILAI', user.pesertaid, nilaiForm);
    } else if (currentStep === 4) {
      updatePesertaData('BERKAS', user.pesertaid, berkasForm);
    }
  };

  const nextStep = () => {
    if (step === 3) {
       if (nilaiForm.pilihan1 === nilaiForm.pilihan2 && nilaiForm.pilihan1) {
           alert("Pilihan jurusan 1 dan 2 tidak boleh sama!");
           return;
       }
    }
    saveData(step);
    setStep(step + 1);
    window.scrollTo(0,0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0,0);
  };

  const finalSubmit = () => {
     if (confirm('Apakah Anda yakin ingin mengirim data? Data tidak dapat diubah setelah dikirim.')) {
         if (user?.pesertaid && user.username) {
            changeStatus(user.pesertaid, StatusPeserta.SUBMITTED, user.username);
            navigate('/dashboard');
         }
     }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4 mb-4">
         <h3 className="text-xl font-bold text-gray-800">Data Pribadi</h3>
         <p className="text-gray-500 text-sm">Lengkapi data identitas calon siswa.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="NISN" name="nisn" value={pesertaForm.nisn || ''} onChange={handlePesertaChange} disabled={isReadOnly} required placeholder="Nomor Induk Siswa Nasional" />
        <Input label="Nama Lengkap" name="nama" value={pesertaForm.nama || ''} onChange={handlePesertaChange} disabled={true} className="bg-gray-100" />
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div className="relative">
                <select name="jk" value={pesertaForm.jk || 'L'} onChange={handlePesertaChange} disabled={isReadOnly} className="appearance-none w-full px-4 py-2.5 border rounded-lg shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        <Input label="Tempat Lahir" name="tempatlahir" value={pesertaForm.tempatlahir || ''} onChange={handlePesertaChange} disabled={isReadOnly} required />
        <Input label="Tanggal Lahir" type="date" name="tanggallahir" value={pesertaForm.tanggallahir || ''} onChange={handlePesertaChange} disabled={isReadOnly} required />
        <Input label="No HP (WhatsApp)" name="nohp" value={pesertaForm.nohp || ''} onChange={handlePesertaChange} disabled={isReadOnly} required />
        <Input label="Asal Sekolah" name="sekolahasal" value={pesertaForm.sekolahasal || ''} onChange={handlePesertaChange} disabled={isReadOnly} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
        <textarea 
            name="alamat" 
            value={pesertaForm.alamat || ''} 
            onChange={(e) => setPesertaForm({...pesertaForm, alamat: e.target.value})} 
            disabled={isReadOnly} 
            className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
            rows={3}
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
        ></textarea>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-3 text-sm">A</span>
              Data Ayah Kandung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Ayah" name="namaayah" value={pesertaForm.namaayah || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Input label="NIK Ayah" name="nikayah" value={pesertaForm.nikayah || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Input label="Tahun Lahir" name="tahunlahirayah" value={pesertaForm.tahunlahirayah || ''} onChange={handlePesertaChange} disabled={isReadOnly} placeholder="YYYY" />
            <Select label="Pekerjaan" name="pekerjaanayah" options={PEKERJAAN_OPTIONS} value={pesertaForm.pekerjaanayah || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Select label="Penghasilan" name="penghasilanayah" options={PENGHASILAN_OPTIONS} value={pesertaForm.penghasilanayah || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
          </div>
       </div>

       <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
          <h3 className="text-lg font-bold text-pink-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-pink-200 text-pink-700 rounded-full flex items-center justify-center mr-3 text-sm">B</span>
              Data Ibu Kandung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Ibu" name="namaibu" value={pesertaForm.namaibu || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Input label="NIK Ibu" name="nikibu" value={pesertaForm.nikibu || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Input label="Tahun Lahir" name="tahunlahiribu" value={pesertaForm.tahunlahiribu || ''} onChange={handlePesertaChange} disabled={isReadOnly} placeholder="YYYY" />
            <Select label="Pekerjaan" name="pekerjaanibu" options={PEKERJAAN_OPTIONS} value={pesertaForm.pekerjaanibu || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
            <Select label="Penghasilan" name="penghasilanibu" options={PENGHASILAN_OPTIONS} value={pesertaForm.penghasilanibu || ''} onChange={handlePesertaChange} disabled={isReadOnly} />
          </div>
       </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Peminatan Jurusan</h3>
          <p className="text-gray-500 text-sm">Pilih prioritas jurusan yang diminati.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <Select label="Pilihan Pertama (Prioritas)" name="pilihan1" options={JURUSAN_OPTIONS} value={nilaiForm.pilihan1 || ''} onChange={handleNilaiChange} disabled={isReadOnly} required className="bg-white" />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Select label="Pilihan Kedua" name="pilihan2" options={JURUSAN_OPTIONS} value={nilaiForm.pilihan2 || ''} onChange={handleNilaiChange} disabled={isReadOnly} required className="bg-white" />
        </div>
      </div>
      
      <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Input Nilai Rapor (Skala 0-100)</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((sem) => (
                <div key={sem} className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-blue-700 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center mr-2">{sem}</span>
                        Semester {sem}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {(['ipa', 'ips', 'mtk', 'bindo', 'bing'] as const).map((subj) => {
                            const fieldName = `s${sem}_${subj}` as keyof NilaiData;
                            return (
                                <div key={fieldName}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{subj}</label>
                                    <input 
                                        type="number" 
                                        name={fieldName}
                                        value={nilaiForm[fieldName] as number || 0}
                                        onChange={handleNilaiChange}
                                        disabled={isReadOnly}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                                        min={0} max={100}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );

  const FileUploadBox = ({ label, field, value }: { label: string, field: keyof BerkasData, value?: string }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors bg-white">
        <div className="flex flex-col items-center justify-center text-center">
             <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <label className="block font-medium text-gray-900 mb-1">{label}</label>
            <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload file</span>
                    <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, field)} disabled={isReadOnly} />
                </label>
                <p className="pl-1">atau drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 2MB</p>
            {value && (
                <div className="mt-3 flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {value}
                </div>
            )}
        </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm">
          <div className="flex">
              <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
              </div>
              <div className="ml-3">
                  <p className="text-sm text-yellow-700">Pastikan hasil scan/foto dokumen terlihat jelas dan tidak buram.</p>
              </div>
          </div>
      </div>
      
      <h3 className="text-lg font-bold border-b pb-2 text-gray-800 mt-6">Dokumen Wajib</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadBox label="Kartu Keluarga (KK)" field="kk" value={berkasForm.kk} />
          <FileUploadBox label="Rapor Semester 1" field="rapot1" value={berkasForm.rapot1} />
          <FileUploadBox label="Rapor Semester 2" field="rapot2" value={berkasForm.rapot2} />
          <FileUploadBox label="Rapor Semester 3" field="rapot3" value={berkasForm.rapot3} />
          <FileUploadBox label="Rapor Semester 4" field="rapot4" value={berkasForm.rapot4} />
          <FileUploadBox label="Rapor Semester 5" field="rapot5" value={berkasForm.rapot5} />
      </div>

      <h3 className="text-lg font-bold border-b pb-2 text-gray-800 mt-8">Dokumen Pendukung</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadBox label="Sertifikat Prestasi (Opsional)" field="prestasi1" value={berkasForm.prestasi1} />
          <FileUploadBox label="Kartu KIP/Afirmasi (Jika ada)" field="afirmasi" value={berkasForm.afirmasi} />
       </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-8 animate-fade-in">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Akhir</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">Silakan periksa kembali ringkasan data Anda di bawah ini sebelum melakukan submit final.</p>

        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-left">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-bold text-gray-700">Ringkasan Pendaftaran</h4>
            </div>
            <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Nama Lengkap</span>
                    <span className="font-medium">{pesertaForm.nama}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">NISN</span>
                    <span className="font-medium">{pesertaForm.nisn}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Jurusan Pilihan 1</span>
                    <span className="font-bold text-blue-600">{nilaiForm.pilihan1?.split('|')[1]}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Jurusan Pilihan 2</span>
                    <span className="font-medium text-gray-700">{nilaiForm.pilihan2?.split('|')[1]}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Kelengkapan Berkas</span>
                    <span className={`font-bold ${berkasForm.kk ? 'text-green-600' : 'text-red-500'}`}>{berkasForm.kk ? 'Lengkap' : 'Belum Lengkap'}</span>
                </div>
            </div>
        </div>

        {!isReadOnly && (
             <div className="mt-8 bg-red-50 p-4 border border-red-200 rounded-xl text-red-700 text-sm max-w-2xl mx-auto flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <p className="text-left"><strong>Peringatan:</strong> Setelah menekan tombol SUBMIT, data akan dikunci dan status menjadi <strong>SUBMITTED</strong>. Anda tidak dapat melakukan perubahan data kecuali diminta perbaikan oleh panitia.</p>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
         {/* Custom Progress Bar */}
         <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300 rounded-full -z-10"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
                
                {STEPS.map((s, i) => {
                    const stepNum = i + 1;
                    const isActive = step === stepNum;
                    const isCompleted = step > stepNum;
                    return (
                        <div key={i} className="flex flex-col items-center group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${
                                isActive ? 'bg-blue-600 border-white text-white shadow-lg scale-110' : 
                                isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                                'bg-white border-gray-300 text-gray-400'
                            }`}>
                                {isCompleted ? '✓' : stepNum}
                            </div>
                            <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
                        </div>
                    )
                })}
            </div>
         </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-10">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </div>

            <div className="bg-gray-50 px-8 py-5 flex justify-between border-t border-gray-100">
                <button 
                    onClick={prevStep} 
                    disabled={step === 1}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &larr; Kembali
                </button>
                
                {step < 5 ? (
                    <button 
                        onClick={nextStep}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5"
                    >
                        Simpan & Lanjut &rarr;
                    </button>
                ) : (
                    !isReadOnly && (
                        <button 
                            onClick={finalSubmit}
                            className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                        >
                            SUBMIT FORMULIR
                        </button>
                    )
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormPeserta;