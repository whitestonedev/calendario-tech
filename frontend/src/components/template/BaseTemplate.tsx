import React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';

interface BaseTemplateProps {
  children: React.ReactNode;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ children }) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <div
      className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 dark' : 'bg-gray-100'}`}
    >
      <Navbar isDarkMode={isDarkMode} className="w-full" />
      <main className="flex-grow">{children}</main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default BaseTemplate;
