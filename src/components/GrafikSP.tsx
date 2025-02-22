import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import API from "../api/api"; // Sesuaikan dengan path API-mu

export default function GrafikSP() {
  const [series, setSeries] = useState([{ name: "spCount", data: Array(12).fill(0) }]);

  useEffect(() => {
    fetchSPData();
  }, []);

  const fetchSPData = async () => {
    try {
      const { data } = await API.get("/siswa/sp-bulanan"); // Ganti dengan endpoint API-mu
      processData(data);
    } catch (error) {
      console.error("Gagal mengambil data Surat Pembinaan:", error);
    }
  };

  const processData = (data: any[]) => {
    const monthlyData = Array(12).fill(0);

    data.forEach((item) => {
      const month = new Date(item.tanggal).getMonth(); // Ambil bulan dari tanggal
      monthlyData[month] += 1; // Tambah jumlah surat pembinaan di bulan tersebut
    });

    setSeries([{ name: "Surat Pembinaan", data: monthlyData }]);
  };

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val}` },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Grafik Surat Pembinaan 2025</h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
