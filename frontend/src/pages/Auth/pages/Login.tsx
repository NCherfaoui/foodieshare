import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <LoginForm onSubmit={login} />
    </div>
  );
};

export default LoginPage;