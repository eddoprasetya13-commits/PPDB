import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-600 transition-all duration-200 ${
          error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-600' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 animate-pulse">{error}</p>}
    </div>
  );
};

export default Input;