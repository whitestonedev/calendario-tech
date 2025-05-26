import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MultiStepEventForm from './MultiStepEventForm';
import { useLanguage } from '@/context/LanguageContext';

interface SubmitEventDialogProps {
  trigger?: React.ReactNode;
}

const SubmitEventDialog: React.FC<SubmitEventDialogProps> = ({ trigger = null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useLanguage();

  const defaultTrigger = (
    <Button className="bg-tech-purple hover:bg-tech-purple/90">{t('nav.addEvent')}</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialog.title')}</DialogTitle>
          <DialogDescription>{t('dialog.description')}</DialogDescription>
        </DialogHeader>
        <MultiStepEventForm />
      </DialogContent>
    </Dialog>
  );
};

export default SubmitEventDialog;
