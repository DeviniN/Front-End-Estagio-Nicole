'use client';
import React from "react";

interface InputProps {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  state?: "default" | "error" | "success";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClickIcon?: () => void;
  helperText?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  state = "default",
  disabled = false,
  className = "",
  icon,
  onClickIcon,
  helperText,
  autoComplete = "off",
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  const stateClasses = {
    default:
      "border-gray-300 focus:border-primary-purple focus:ring-primary-purple/20",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500/20",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const inputId = id || name;

  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`${baseClasses} ${stateClasses[state]} ${disabledClasses} ${className} ${
            icon ? 'pr-10' : ''
          }`}
        />

        {icon && (
          <button
            type="button"
            onClick={onClickIcon}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-purple transition-colors"
            disabled={disabled}
          >
            {icon}
          </button>
        )}
      </div>

      {helperText && (
        <p
          className={`text-xs mt-1 ${
            state === 'error'
              ? 'text-red-500'
              : state === 'success'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

// Dentro do componente Input
// Exemplo de uso removido para evitar erro de compilação.
// Utilize o componente Input em outro arquivo, passando todas as props obrigatórias.