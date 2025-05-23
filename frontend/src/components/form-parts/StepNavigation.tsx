import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitStep: boolean;
  onSubmitClick?: () => void; // <- aqui
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitStep,
  onSubmitClick,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        {t("form.previous")}
      </Button>

      {!isSubmitStep ? (
        <Button
          type="button"
          onClick={onNext}
          className="bg-tech-purple hover:bg-tech-purple/90"
        >
          {t("form.next")}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => {
            onSubmitClick?.();
          }}
          className="bg-tech-purple hover:bg-tech-purple/90"
        >
          {t("form.submit")}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
