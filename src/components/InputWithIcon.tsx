import {
  ChangeEvent,
  InputHTMLAttributes,
  ComponentType,
  SVGProps,
  ReactNode,
  useState,
} from "react";
import { IconType } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: IconType | ComponentType<SVGProps<SVGSVGElement>> | ReactNode;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <div className="absolute z-30 border-r border-gray-200 inset-y-0 left-0 px-3 flex items-center pointer-events-none">
        {typeof Icon === "function" ? (
          <Icon className="w-[16px] h-[16px] text-gray-400" />
        ) : (
          Icon
        )}
      </div>

      <input
        id={name}
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        required={required}
        className={`appearance-none bg-white placeholder:text-gray-400 text-gray-700 relative block w-full pl-12 pr-10 py-2 border border-gray-200 rounded-[4px] focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <FaEyeSlash className="w-[16px] h-[16px]" />
          ) : (
            <FaEye className="w-[16px] h-[16px]" />
          )}
        </button>
      )}
    </div>
  );
};

export default InputWithIcon;
