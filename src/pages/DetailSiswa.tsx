import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../components/ui/table";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import Swal from "sweetalert2";

type SP = {
  id: string;
  jenisPelanggaran: string;
  keterangan: string;
  tanggal: string;
  admin: { name: string };
};

type FingerprintData = {
  siswaId: string;
  nama: string;
  tanggal: string;
  scanMasuk: string;
  absent: boolean;
};

const formatTanggal = (tanggal: string) => {
  return new Date(tanggal).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
};

const formatTanggalFinger = (tanggal: string) => {
  return new Date(tanggal).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
}

const DetailSiswa = () => {
  const { id, nama, kelas } = useParams<{ id: string; nama: string; kelas: string }>();
  const [spList, setSpList] = useState<SP[]>([]);
  const [fingerprintList, setFingerprintList] = useState<FingerprintData[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailSP = async () => {
      try {
        const { data } = await API.get<SP[]>(`/siswa/${id}/detail-sp`);
        setSpList(data);
      } catch (error) {
        console.error("Error fetching SP:", error);
      }
    };

    const fetchFingerprintData = async () => {
      try {
        const { data } = await API.get<FingerprintData[]>(`/siswa/${id}/fingerprint`);
        setFingerprintList(data);
      } catch (error) {
        console.error("Error fetching fingerprint data:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await API.get("/admin/me");
        setRole(response.data.name.role);
      } catch (error) {
        console.error("Gagal mengambil data role", error);
      }
    };

    fetchDetailSP();
    fetchFingerprintData();
    fetchUserRole();
  }, [id]);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  };

  const handleDeleteSP = async (spId: string) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/siswa/delete/${spId}`);
          setSpList((prev) => prev.filter((sp) => sp.id !== spId));
          Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
        } catch (error) {
          console.error("Gagal menghapus SP:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
        }
      }
    });
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mt-4 dark:text-white">Detail Surat Pembinaan</h2>
      <p className="text-lg dark:text-white">Nama: {nama}</p>
      <p className="text-lg dark:text-white">Kelas: {kelas}</p>

      <Table className="mt-5 mb-5 overflow-x-auto">
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jenis Pelanggaran</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Keterangan</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Diberikan oleh</TableCell>
            {role === "1" && <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {spList.length > 0 ? (
            spList.map((sp, index) => (
              <TableRow key={sp.id}>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{index + 1}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{formatTanggal(sp.tanggal)}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{sp.jenisPelanggaran}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{sp.keterangan}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {sp.admin?.name || "Tidak diketahui"}
                </TableCell>
                {role === "1" && (
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <button onClick={() => handleDeleteSP(sp.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                Belum ada data leaderboard SP.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold mt-4 dark:text-white">Data Fingerprint</h2>
      <Table className="mt-5 mb-5 overflow-x-auto">
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Waktu</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fingerprint</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {fingerprintList.length > 0 ? (
            fingerprintList.map((fingerprint, index) => (
              <TableRow key={fingerprint.siswaId}>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{index + 1}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{formatTanggalFinger(fingerprint.tanggal)}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{fingerprint.scanMasuk}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex items-center gap-2">
                  {fingerprint.absent ? (
                    <>
                      <XCircle className="text-red-500 w-5 h-5" /> {/* Ikon hijau */}
                      <span>Tidak</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="text-green-500 w-5 h-5" /> {/* Ikon merah */}
                      <span>Ya</span>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                Belum ada data fingerprint.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailSiswa;