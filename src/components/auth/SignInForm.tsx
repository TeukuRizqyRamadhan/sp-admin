import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import API from "../../api/api";
import Swal from "sweetalert2";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      Swal.fire({
        title: "Login Berhasil!",
        text: "Selamat datang di dashboard",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire({
        title: "Login Gagal!",
        text: "Periksa kembali email dan password Anda.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full p-5">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <img
              className="mx-auto dark:hidden"
              src="../src/assets/SMP.png"
              width={300}
              alt="Logo SMP"
            />
            <img
              className="mx-auto hidden dark:block "
              src="../src/assets/SMP-dark.png"
              width={300}
              alt="Logo SMP"
            />
          </div>
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button className="w-full" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
