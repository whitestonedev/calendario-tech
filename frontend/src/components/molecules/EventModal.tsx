import React, { useEffect, useRef, useState } from 'react'; // Import useState

import { useTranslation } from 'react-i18next';

interface EventModalProps {
  event: EventApiData | null;
  onClose: () => void;
}

interface EventApiData {
  address: string;
  end_datetime: string;
  event_link: string;
  event_name: string;
  intl: {
    'en-us': {
      banner_link: string;
      cost: string;
      event_edition: string;
      short_description: string;
    };
    'pt-br': {
      banner_link: string;
      cost: string;
      event_edition: string;
      short_description: string;
    };
  };
  maps_link: string;
  online: boolean;
  organization_name: string;
  start_datetime: string;
  tags?: string[];
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'pt-BR' | 'en-US';
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.body.style.overflow = 'hidden';

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = '';
      window.removeEventListener('resize', checkMobile);
    };
  }, [onClose]);

  if (!event) {
    return null;
  }

  const intl = event.intl[currentLang === 'pt-BR' ? 'pt-br' : 'en-us'];
  const isFree =
    intl.cost.toLowerCase() === t('eventModal.freeOption').toLowerCase() ||
    intl.cost.toLowerCase() === 'free' ||
    intl.cost.toLowerCase() === 'grátis';

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);
  const formattedStartDate = startDate.toLocaleDateString(currentLang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedStartTime = startDate.toLocaleTimeString(currentLang, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedEndDate = endDate.toLocaleDateString(currentLang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedEndTime = endDate.toLocaleTimeString(currentLang, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 dark:bg-neutral-800 dark:bg-opacity-75 overflow-y-auto">
      <div
        className={`bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden w-full max-h-[95vh] ${isMobile ? 'max-w-full h-full' : 'max-w-3xl'}`} //Largura e altura do modal condicional
        ref={modalRef}
      >
        {intl.banner_link && (
          <img
            src={intl.banner_link}
            alt={`${event.event_name} Banner`}
            className="w-full h-auto max-h-[200px] object-cover rounded-t-lg"
          />
        )}
        <div
          className={`px-8 py-6  overflow-y-auto ${isMobile ? 'max-h-full' : 'max-h-[calc(95vh - 200px)]'}`}
        >
          {' '}
          <div className="flex justify-between items-start mb-6">
            <h3
              className={`text-2xl font-bold text-text-primary dark:text-text-light ${isMobile ? 'text-center' : ''}`}
            >
              {event.event_name}
            </h3>{' '}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${isMobile ? 'block' : 'grid grid-cols-1 md:grid-cols-2'} gap-x-8 gap-y-4`}
          >
            <div>
              <div className="mb-4">
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">🗓️</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.date')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 ml-7">
                  {formattedStartDate} - {formattedEndDate}
                </p>
                <div className="flex items-center mt-1 ml-7 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">⏱️</span>
                  <p className="text-neutral-700 dark:text-neutral-300 ">
                    {formattedStartTime} - {formattedEndTime}
                  </p>
                </div>
              </div>

              <div
                className="mb-4"
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                {' '}
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">🏢</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.organization')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 ml-7">
                  {event.organization_name}
                </p>
              </div>

              <div
                className="mb-4"
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">📍</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.address')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 ml-7">
                  {event.address}
                </p>
              </div>

              <div
                className="mb-4"
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                {/* Oculta tipo (online/presencial) no mobile */}
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">🌐</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.online')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 ml-7">
                  {event.online
                    ? t('eventModal.onlineOption')
                    : t('eventModal.inPersonOption')}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-5">
                <div className="flex items-start mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">ℹ️</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.description')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {intl.short_description}
                </p>
              </div>

              <div
                className="mb-5"
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                {/* Oculta tags no mobile */}
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">🏷️</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.tags')}:
                  </strong>
                </div>
                {Array.isArray(event.tags) && (
                  <ul className="flex flex-wrap">
                    {event.tags.map((tag, index) => (
                      <li
                        key={index}
                        className="bg-accent-100 dark:bg-accent-700 text-accent-700 dark:text-accent-100 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                {!Array.isArray(event.tags) && (
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {t('eventModal.noTags')}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <div className="flex items-center mb-2 text-accent-500 dark:text-accent-300">
                  <span className="mr-2 text-xl">💰</span>
                  <strong className="font-semibold text-text-primary dark:text-text-light">
                    {t('eventModal.cost')}:
                  </strong>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {isFree ? (
                    <span className="text-green-500 font-semibold">
                      {t('eventModal.free')} 🎉
                    </span>
                  ) : (
                    intl.cost
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-neutral-100 dark:bg-neutral-800 border-t dark:border-neutral-700 flex justify-end">
          <a
            href={event.event_link}
            target="_blank"
            className="bg-accent-500 hover:bg-accent-700 text-white font-semibold py-3 px-6 rounded-md text-sm"
          >
            {t('eventModal.eventLinkButton')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
