import React, { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  className?: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ className = '' }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling up (current < last) or at the top
      if (currentScrollY < lastScrollY.current || currentScrollY === 0) {
        setShowScrollTop(false);
      }
      // If scrolling down and past threshold
      else if (currentScrollY > 300) {
        setShowScrollTop(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 bg-tech-purple text-white p-3 rounded-full shadow-lg hover:bg-tech-purple/90 transition-all duration-300 z-50 ${
        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } ${className}`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;
