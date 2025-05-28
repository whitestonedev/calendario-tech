'use client';

import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate, useInView } from 'motion/react';
import { useEffect } from 'react';

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  fontWeight = 'normal',
  textClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  fontWeight?: 'normal' | 'bold';
  textClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(''),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: 'easeInOut',
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline-flex items-center">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black opacity-0 hidden`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div className={cn('flex space-x-1 my-6 items-center', className)}>
      <motion.div>
        <div
          className={cn(
            'text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg',
            fontWeight === 'bold' ? 'font-bold' : 'font-normal',
            'leading-none',
            textClassName
          )}
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'block rounded-sm w-[3px] h-4 sm:h-5 md:h-6 bg-blue-500 self-center',
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  fontWeight = 'normal',
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  fontWeight?: 'normal' | 'bold';
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(''),
    };
  });
  const renderWords = () => {
    return (
      <div className="inline-flex items-center">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('flex space-x-1 my-6 items-center', className)}>
      <motion.div
        className="overflow-hidden"
        initial={{
          width: '0%',
        }}
        whileInView={{
          width: 'fit-content',
        }}
        transition={{
          duration: 2,
          ease: 'linear',
          delay: 1,
        }}
      >
        <div
          className={cn(
            'text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg',
            fontWeight === 'bold' ? 'font-bold' : 'font-normal',
            'leading-none'
          )}
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'block rounded-sm w-[3px] h-4 sm:h-5 md:h-6 bg-blue-500 self-center',
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
