import PageMeta from "../../components/common/PageMeta";
import RingkasanSuratPembinaan from "../../components/RingkasanSuratPembinaan";
import GrafikSP from "../../components/GrafikSP";
import Top5SuratPembinaan from "../../components/Top5SuratPembinaan";
import PencarianSiswa from "../../components/PencarianSiswa";
import Informasi from "../../components/Informasi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  };
  return (
    <>
      <PageMeta title="Surat Pembinaan" description="Surat Pembinaan" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <RingkasanSuratPembinaan />

          <GrafikSP />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Top5SuratPembinaan />
          <Informasi />
        </div>

        <div className="col-span-12">
          <PencarianSiswa />
        </div>
      </div>
    </>
  );
}
