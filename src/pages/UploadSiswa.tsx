import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useState, useEffect } from "react";
import API from "../api/api";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

type Siswa = {
  nama: string;
  kelas: string;
};

export default function UploadSiswa() {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse<Siswa>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.filter((row) => row.nama && row.kelas);
        setDataSiswa(parsedData);
      },
      error: (error) => {
        alert("Gagal membaca file. Pastikan format CSV benar.");
        console.error("Parsing error:", error);
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (dataSiswa.length === 0) {
      alert("Tidak ada data yang valid untuk diunggah.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/siswa/upload-massal", { data: dataSiswa });
      alert("Data siswa berhasil diunggah!");
      setDataSiswa([]);
      setFileName("");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Gagal mengunggah data siswa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Tambah Siswa" description="Tambah Siswa" />
      <PageBreadcrumb pageTitle="Tambah Siswa" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-6 text-center cursor-pointer rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <input {...getInputProps()} />
            <UploadCloud size={40} className="text-gray-600 dark:text-gray-300 mx-auto mb-2" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Seret & Letakkan file CSV di sini</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">atau klik untuk memilih file</p>
          </div>

          <a
            href="/src/assets/TEST.csv"
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4 transition"
          >
            <UploadCloud size={18} /> Download File Dummy
          </a>

          {fileName && (
            <div className="flex items-center mt-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
              <FileText size={20} className="mr-2" />
              <span>{fileName}</span>
            </div>
          )}

          {dataSiswa.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Preview Data:</h3>
              <div className="max-h-60 overflow-auto border rounded-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Kelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSiswa.map((siswa, index) => (
                      <tr key={index} className="text-center bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{siswa.nama}</td>
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{siswa.kelas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`${loading ? "bg-gray-400 dark:bg-gray-600" : "bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-600"} text-white px-6 py-2 rounded mt-4 w-full text-center flex justify-center items-center gap-2 transition`}
              >
                {loading && <Loader2 size={18} className="animate-spin" />} Upload ke Database
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
