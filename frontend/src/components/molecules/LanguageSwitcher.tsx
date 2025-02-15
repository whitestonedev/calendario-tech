import React, { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentLanguage = i18n.language;

  const getFlagIcon = (lng: string) => {
    if (lng === 'pt') {
      return '🇧🇷';
    } else if (lng === 'en') {
      return '🇬🇧';
    }
    return '';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dropdownRef]);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center gap-x-1.5 rounded-md bg-background-light dark:bg-background-dark px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
          id="language-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <span className="mr-2">{getFlagIcon(currentLanguage)}</span>{' '}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.75a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <button
              onClick={() => changeLanguage('pt')}
              className="text-gray-700 dark:text-neutral-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 w-full text-left flex items-center"
              role="menuitem"
              tabIndex={-1}
            >
              <span className="mr-2">{getFlagIcon('pt')}</span> Português
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="text-gray-700 dark:text-neutral-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 w-full text-left flex items-center"
              role="menuitem"
              tabIndex={-1}
            >
              <span className="mr-2">{getFlagIcon('en')}</span> Inglês
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
