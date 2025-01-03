import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoSvg from "../assets/logo.svg?react";
import EnvelopIcon from "../assets/icons/envalop.svg?react";
import Lock from "../assets/icons/lock.svg?react";
import InputWithIcon from "../components/InputWithIcon";
import LoginContainer from "../components/LoginContainer";

interface Credentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(credentials.email, credentials.password);
    navigate("/dashboard");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <LoginContainer>
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        {/* Logo */}
        <div className="text-center">
          <LogoSvg className="h-12 w-auto mx-auto transition-transform duration-200 hover:scale-110" />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-medium text-gray-700">
          Sign in to ERP
        </h2>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email*
            </label>
            <InputWithIcon
              icon={EnvelopIcon}
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password*
            </label>
            <InputWithIcon
              icon={Lock}
              name="password"
              type="password"
              required
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-brand-primary hover:text-brand-hover"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
          >
            Login
          </button>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-brand-primary"
            >
              Register now for new account
            </Link>
          </div>
        </form>
      </div>
    </LoginContainer>
  );
};

export default Login;
