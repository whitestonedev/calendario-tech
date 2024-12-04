import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  className,
  onChange,
  value,
  onFocus,
  onBlur,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    onChange={onChange}
    value={value}
    onFocus={onFocus}
    onBlur={onBlur}
  />
);

export default Input;
