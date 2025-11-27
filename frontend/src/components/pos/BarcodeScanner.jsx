import { useState, useEffect, useRef } from 'react';
import { Scan } from 'lucide-react';

const BarcodeScanner = ({ onScan, enabled = true }) => {
  const [buffer, setBuffer] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Clear timeout on new keypress
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (e.key === 'Enter' && buffer.length > 0) {
        onScan(buffer);
        setBuffer('');
        return;
      }

      // Only accept alphanumeric characters
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        setBuffer((prev) => prev + e.key);
      }

      // Clear buffer after 100ms of inactivity (barcode scanners are fast)
      timeoutRef.current = setTimeout(() => {
        setBuffer('');
      }, 100);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [buffer, enabled, onScan]);

  if (!enabled) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Scan className="w-4 h-4" />
      <span>Barcode scanner ready</span>
      {buffer && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{buffer}</span>}
    </div>
  );
};

export default BarcodeScanner;
