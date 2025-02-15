import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  className,
  onClick,
  children,
  type = 'button',
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded bg-background text-white hover:bg-blue-700 ${className}`}
      type={type} // Passando a prop 'type' para o elemento <button>
    >
      {children}
    </button>
  );
};

export default Button;
