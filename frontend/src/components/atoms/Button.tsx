import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded bg-background text-white hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
