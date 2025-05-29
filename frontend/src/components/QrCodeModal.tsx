import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { EventInterface } from '@/types/event';

interface QrCodeModalProps {
  event: EventInterface | null;
  eventUrl: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ event, eventUrl }) => {
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { t } = useLanguage();

  const downloadQrCodeAsPng = () => {
    const svgElement = document.getElementById('qrcode-svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const padding = 32;
    const svgSize = svgElement.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = svgSize.width + padding * 2;
    canvas.height = svgSize.height + padding * 2;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2D context not supported');
      return;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, padding, padding);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `qrcode-${event?.event_name.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 'image/png');
    };

    img.onerror = (e) => {
      console.error('Erro ao carregar SVG como imagem', e);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const shareQrCodeImage = async () => {
    if (isSharing) return;
    setIsSharing(true);

    const svgElement = document.getElementById('qrcode-svg');
    if (!svgElement || !navigator.share) {
      console.log('Web Share API não suportada ou SVG não encontrado.');
      setIsSharing(false);
      return;
    }

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Não foi possível obter contexto 2D para o canvas.');
        setIsSharing(false);
        return;
      }

      const svgSize = svgElement.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const pngFile = new File(
              [blob],
              `qrcode-${event?.event_name.replace(/\s+/g, '-')}.png`,
              { type: 'image/png' }
            );

            try {
              await navigator.share({
                files: [pngFile],
                title: event?.event_name || t('event.qrCodeTitle'),
                text: `${t('event.shareQrCodeMessage')} ${eventUrl}`,
              });
              setIsQrCodeModalOpen(false);
            } catch (error) {
              console.error('Erro ao compartilhar QR Code PNG:', error);
            } finally {
              setIsSharing(false);
            }
          } else {
            console.error('Falha ao criar Blob PNG.');
            setIsSharing(false);
          }
        }, 'image/png');
      };

      img.onerror = (error) => {
        console.error('Erro ao carregar imagem SVG para o canvas:', error);
        URL.revokeObjectURL(url);
        setIsSharing(false);
      };

      img.src = url;
    } catch (error) {
      console.error('Erro geral ao gerar ou compartilhar QR Code PNG:', error);
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isQrCodeModalOpen} onOpenChange={setIsQrCodeModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-tech-purple hover:bg-tech-purple/10"
          title={t('event.generateQRCode')}
        >
          <QrCode className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('event.qrCodeTitle')}</DialogTitle>
          <DialogDescription>
            {t('event.shareQrCodeMessage')} {eventUrl}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {event && (
            <QRCodeSVG
              id="qrcode-svg"
              value={eventUrl}
              size={256}
              level={'H'}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={downloadQrCodeAsPng}
            className="flex-1 w-full sm:w-auto"
          >
            {t('event.downloadQrCode')}
          </Button>
          <Button
            onClick={() => {
              shareQrCodeImage();
            }}
            disabled={isSharing}
            className="flex-1 w-full sm:w-auto bg-tech-purple hover:bg-tech-purple/90"
          >
            <Share2 className="h-5 w-5 mr-2" />
            {isSharing ? t('common.loading') : t('event.share')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
