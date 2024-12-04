import React, { useEffect } from 'react';

import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { useDispatch, useSelector } from 'react-redux';

import useScreenSize from '../../hooks/useScreenSize';
import { RootState } from '../../store';
import { toggleDarkMode } from '../../store/reducers/themeSlice';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

interface NavbarProps {
  className?: string;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isMobileScreen, setIsMobileScreen] = React.useState(false);
  const screenSize = useScreenSize();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    setIsMobileScreen(screenSize.isMobileView);
  }, [screenSize.isMobileView]);

  const desktopView = () => {
    return (
      <nav
        className={`fixed top-0 w-full flex items-center justify-between p-4 !${className}`}
      >
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => dispatch(toggleDarkMode())}
              className={'!bg-transparent'}
            >
              <Icon
                icon={isDarkMode ? faMoon : faSun}
                size="lg"
                className={`ml-2 transition-transform duration-500 ${
                  isDarkMode
                    ? 'rotate-0 text-primary'
                    : 'rotate-180 text-accent'
                }`}
              />
            </Button>
          </div>
        </div>
      </nav>
    );
  };

  return isMobileScreen ? desktopView() : desktopView();
};

export default Navbar;
