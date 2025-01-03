import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

import InputWithIcon from "../components/InputWithIcon";
import LoginContainer from "../components/LoginContainer";
import LogoSvg from "@/components/icons/LogoSvg";
import LockIcon from "@/components/icons/LockIcon";
import LocationIcon from "@/components/icons/Location";
import Category from "@/components/icons/Category";
import UserIcon from "@/components/icons/UserIcon";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
import BusinessIcon from "@/components/icons/BusinessIcon";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  businessName: string;
  businessType: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    location: "",
    businessName: "",
    businessType: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your registration logic here
    navigate("/login");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <LoginContainer>
      <div className="max-w-2xl w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        {/* Logo */}
        <div className="text-center">
          <LogoSvg className="h-12 w-auto mx-auto transition-transform duration-200 hover:scale-110" />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-medium text-gray-700">
          Register New Account
        </h2>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                What's your name?
              </label>
              <InputWithIcon
                icon={UserIcon}
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                What's your Email*
              </label>
              <InputWithIcon
                icon={EnvelopeIcon}
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                What's the Phone Number
              </label>
              <InputWithIcon
                icon={PhoneIcon}
                name="phone"
                type="tel"
                placeholder="Enter your number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Where is your location?*
              </label>
              <InputWithIcon
                icon={LocationIcon}
                name="location"
                type="text"
                required
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Business Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700"
              >
                What is your business name?*
              </label>
              <InputWithIcon
                icon={BusinessIcon}
                name="businessName"
                type="text"
                required
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>

            {/* Business Type Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700"
              >
                What kind of business do you run?*
              </label>
              <InputWithIcon
                icon={Category}
                name="businessType"
                type="text"
                required
                placeholder="Enter your business type"
                value={formData.businessType}
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
                icon={LockIcon}
                name="password"
                type="password"
                required
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password*
              </label>
              <InputWithIcon
                icon={LockIcon}
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
          >
            Register
          </button>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-brand-primary hover:text-brand-hover"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </LoginContainer>
  );
};

export default Register;
