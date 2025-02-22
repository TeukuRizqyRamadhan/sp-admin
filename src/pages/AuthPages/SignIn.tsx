import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignIn() {

  useEffect(() => {
    checkToken();
  }, []);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  };
  return (
    <>
      <PageMeta
        title="Login Surat Pembinaan"
        description="Login Surat Pembinaan"
      />
      <SignInForm />
    </>
  );
}
