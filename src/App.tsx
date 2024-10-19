import { useState } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, RefreshCw } from 'lucide-react';

import { generateEpcQr, parseUpnQr } from './lib/qr';

function App() {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleOnScan = (data: IDetectedBarcode[]) => {
    const [scanResult] = data;
    if (!scanResult || scanResult.format === 'unknown') return;

    try {
      const upnQrCode = parseUpnQr(scanResult.rawValue);
      const epcQrCode = generateEpcQr(upnQrCode);

      setCode(epcQrCode);
      setIsScanning(false);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleReset = () => {
    setCode(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>QR Code Converter</CardTitle>
          <CardDescription>Convert UPN QR to EPC QR</CardDescription>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <div className="aspect-square">
              <Scanner onScan={handleOnScan} />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {code && <QRCode value={code} />}
              <Button onClick={handleReset} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Scan Another Code
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isScanning && (
            <div className="text-center mt-4">
              <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Scan a UPN QR code to convert
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
