import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}

export const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({
  value,
  size = 72,
  darkColor = '#000000',
  lightColor = '#ffffff',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: darkColor,
            light: lightColor,
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [value, size, darkColor, lightColor]);

  return <canvas ref={canvasRef} className={`rounded ${className}`} style={{ width: size, height: size }} />;
};
