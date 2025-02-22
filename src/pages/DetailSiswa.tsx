import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../components/ui/table";

type SP = {
  id: string;
  jenisPelanggaran: string;
  keterangan: string;
  tanggal: string;
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

const DetailSiswa = () => {
  const { id, nama, kelas } = useParams<{ id: string; nama: string; kelas: string }>();
  const [spList, setSpList] = useState<SP[]>([]);
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
    fetchDetailSP();
  }, [id]);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mt-4 dark:text-white">Detail Surat Pembinaan</h2>
      <p className="text-lg dark:text-white">Nama: {nama}</p>
      <p className="text-lg dark:text-white">Kelas: {kelas}</p>

      <Table className="mt-5 mb-5">
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jenis Pelanggaran</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Keterangan</TableCell>
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
              </TableRow>
            ))
          ) : (
            <p className="text-gray-500 mt-4 dark:text-white-400">Belum ada data leaderboard SP.</p>
          )}
        </TableBody>
      </Table>

      {/* <h2 className="text-2xl font-bold mt-4 dark:text-white">Absensi Fingerprint (dummy)</h2>
      <p className="text-lg dark:text-white">Fitur belum tersedia</p> */}
    </div>
  );
};

export default DetailSiswa;
