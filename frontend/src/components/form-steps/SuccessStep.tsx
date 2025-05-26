import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SuccessStep: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-4 py-10">
      <CheckCircle className="mx-auto text-green-500" size={48} />
      <h2 className="text-xl font-semibold">{t('form.step.success')}</h2>
      <p className="text-gray-600">{t('form.step.success.desc')}</p>
    </div>
  );
};

export default SuccessStep;
