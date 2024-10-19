import { useState } from 'react';
import QRCode from 'react-qr-code';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import './App.css';
import { generateEpcQr, parseUpnQr } from './lib/qr';

function App() {
  const [code, setCode] = useState<string | null>(null);

  const handleOnScan = (data: IDetectedBarcode[]) => {
    const [scanResult] = data;
    if (!scanResult || scanResult.format === 'unknown') return;

    const upnQrCode = parseUpnQr(scanResult.rawValue);
    const epcQrCode = generateEpcQr(upnQrCode);

    setCode(epcQrCode);
  };

  return (
    <>
      <div>
        {!code ? <Scanner onScan={handleOnScan} /> : <QRCode value={code} />}
      </div>
    </>
  );
}

export default App;
