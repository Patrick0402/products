import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean; 
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false, 
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={label}
        className="block text-gray-800 dark:text-gray-100 font-medium"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled} 
        aria-invalid={!!error} 
        className={`w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${error ? "border-red-500" : "border-gray-300"} 
        ${error ? "text-red-500" : "text-gray-800"} 
        dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 
        ${disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
