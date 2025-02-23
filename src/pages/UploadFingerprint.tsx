import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useState, useEffect } from "react";
import API from "../api/api";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

type FingerprintData = {
  noID: string;
  nama: string;
  tanggal: string;
  scanMasuk: string;
  absent: boolean;
};

export default function UploadFingerprint() {
  const [dataFingerprint, setDataFingerprint] = useState<FingerprintData[]>([]);
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

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.map((row: any) => {
          // Ambil ID dari beberapa kemungkinan format kolom
          const idString = row["No. ID"]?.trim() || row["no id"]?.trim() || "";

          // Parsing tanggal dan mengonversi ke ISO-8601
          const tanggalString = row["Tanggal"]?.trim() || row["tanggal"]?.trim() || "";
          const tanggalISO = new Date(tanggalString).toISOString(); // Konversi ke ISO-8601
          const absentValue = row["Absent"]?.trim() || row["absent"]?.trim() || "";
          const absent = absentValue.length > 0;

          return {
            noID: String(idString), // Pastikan tetap string
            nama: row["Nama"]?.trim() || row["nama"]?.trim() || "",
            tanggal: tanggalISO, // Gunakan tanggal dalam format ISO-8601
            scanMasuk: row["Scan Masuk"]?.trim() || row["scan masuk"]?.trim() || "",
            absent: absent, // Gunakan nilai boolean
          };
        });

        setDataFingerprint(parsedData); // Sesuai dengan tipe FingerprintData[]
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
    if (dataFingerprint.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data!",
        text: "Pastikan file CSV berisi data yang valid sebelum mengunggah.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/siswa/upload-fingerprint", { data: dataFingerprint });

      // Backend harus mengembalikan jumlah data baru yang berhasil disimpan
      const { totalUploaded, totalExisting } = response.data;

      if (totalUploaded === 0 && totalExisting > 0) {
        Swal.fire({
          icon: "info",
          title: "Semua Data Sudah Ada",
          text: "Tidak ada data baru yang diunggah karena semua data sudah ada di database.",
        });
      } else if (totalUploaded > 0 && totalExisting > 0) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Sebagian!",
          text: `Sebagian data sudah ada di database (${totalExisting}), dan sebagian berhasil diunggah (${totalUploaded})!`,
          confirmButtonColor: "#3085d6",
        });
      } else if (totalUploaded > 0 && totalExisting === 0) {
        Swal.fire({
          icon: "success",
          title: "Semua Data Berhasil Diupload!",
          text: `Semua data berhasil diunggah ke database (${totalUploaded} data).`,
          confirmButtonColor: "#3085d6",
        });
      }

      setDataFingerprint([]);
      setFileName("");
    } catch (error) {
      console.error("Error uploading data:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal Mengunggah!",
        text: "Terjadi kesalahan saat mengunggah data fingerprint.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Upload Fingerprint" description="Upload Fingerprint" />
      <PageBreadcrumb pageTitle="Upload Fingerprint" />
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

          {fileName && (
            <div className="flex items-center mt-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
              <FileText size={20} className="mr-2" />
              <span>{fileName}</span>
            </div>
          )}

          {dataFingerprint.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Preview Data:</h3>
              <div className="max-h-60 overflow-auto border rounded-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <th className="border p-2">No. ID</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Tanggal</th>
                      <th className="border p-2">Scan Masuk</th>
                      <th className="border p-2">Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFingerprint.map((item, index) => (
                      <tr key={index} className="text-center bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{item.noID}</td>
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{item.nama}</td>
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{item.tanggal}</td>
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{item.scanMasuk}</td>
                        <td className="border p-2 text-gray-900 dark:text-gray-300">{item.absent ? "True" : "False"}</td>
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
