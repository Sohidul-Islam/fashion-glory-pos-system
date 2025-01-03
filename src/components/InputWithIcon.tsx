import {
  ChangeEvent,
  InputHTMLAttributes,
  ComponentType,
  SVGProps,
  ReactNode,
} from "react";
import { IconType } from "react-icons";

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
        type={type}
        required={required}
        className={`appearance-none bg-white placeholder:text-gray-400 text-gray-700 relative block w-full pl-12 pr-3 py-2 border border-gray-200 rounded-[4px] focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default InputWithIcon;
