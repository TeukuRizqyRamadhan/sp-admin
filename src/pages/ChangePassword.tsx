import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data role pengguna dari API atau localStorage
    const fetchUserRole = async () => {
      try {
        const response = await API.get("/admin/me"); // Sesuaikan endpoint
        setRole(response.data.name.role);
      } catch (error) {
        console.error("Gagal mengambil data role", error);
      }
    };

    fetchUserRole();
  }, []);

  const onSubmit = async (data: FormData) => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengubah kata sandi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const response = await API.put("/admin/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      Swal.fire({
        title: "Berhasil!",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }

    setLoading(false);
  };

  if (role === null) {
    return <p className="text-center text-gray-500">Memuat...</p>;
  }

  if (role === "1") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-black text-center dark:text-white">Maaf, Admin tidak dapat mengubah kata sandi</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Ubah Kata Sandi" description="Ubah Kata Sandi" />
      <PageBreadcrumb pageTitle="Ubah Kata Sandi" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Ubah Kata Sandi</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block font-medium dark:text-white">Kata Sandi Lama</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                {...register("oldPassword", { required: "Kata sandi lama harus diisi" })}
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium dark:text-white">Kata Sandi Baru</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                {...register("newPassword", {
                  required: "Kata sandi baru harus diisi",
                  minLength: { value: 6, message: "Kata sandi minimal 6 karakter" },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium dark:text-white">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                {...register("confirmPassword", {
                  required: "Konfirmasi kata sandi harus diisi",
                  validate: (value) => value === watch("newPassword") || "Kata sandi tidak cocok",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Mengubah..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
