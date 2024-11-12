import { useAuth } from "@/contexts/AuthContext";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = () => {
  const { register } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterForm onSubmit={register} />
    </div>
  );
};

export default RegisterPage;