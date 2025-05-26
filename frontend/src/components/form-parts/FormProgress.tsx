import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Step {
  title: string;
  description: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
  const { t } = useLanguage();

  const validStep = steps[currentStep];

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((_, index) => (
          <div key={index} className={`flex-1 ${index > 0 ? 'ml-2' : ''}`}>
            <div
              className={`h-2 rounded-full ${
                index <= currentStep ? 'bg-tech-purple' : 'bg-gray-200'
              }`}
            ></div>
          </div>
        ))}
      </div>

      {validStep && (
        <>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="font-medium">{validStep.title}</span>
            <span className="text-gray-500">
              {t('form.step')} {currentStep + 1} {t('form.of')} {steps.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{validStep.description}</p>
        </>
      )}
    </div>
  );
};

export default FormProgress;
