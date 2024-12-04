import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fas);

interface IconProps {
  icon: import('@fortawesome/fontawesome-svg-core').IconProp;
  size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '4x' | '5x';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, className, size }) => {
  return <FontAwesomeIcon icon={icon} className={className} size={size} />;
};

export default Icon;
