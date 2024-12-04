import React from 'react';

interface FooterProps {
  className?: string;
  isDarkMode?: boolean;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ className, isDarkMode, children }) => {
  const bgColor = isDarkMode
    ? '!bg-background-dark text-secondary'
    : '!bg-background text-primary';

  const content = () => {
    return children ? (
      <>{children}</>
    ) : (
      <>
        <p>
          © {new Date().getFullYear()} Vitor Stahelin. All rights reserved.
        </p>
      </>
    );
  };

  return (
    <footer className={`${bgColor} ${className} p-6 sticky bottom-0`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-sm mb-4 md:mb-0">{content()}</div>
          <div className="text-sm"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
