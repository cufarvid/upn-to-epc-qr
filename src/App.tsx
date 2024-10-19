import { useState } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import { Camera, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  generateEpcQr,
  generateEpcQrString,
  parseUpnQr,
  type EpcQrData,
} from './lib/qr';
import { EpcQrDataDisplay } from './components/EpcQrDataDisplay';

function App() {
  const [epcData, setEpcData] = useState<EpcQrData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnScan = (data: IDetectedBarcode[]) => {
    const [scanResult] = data;
    if (!scanResult || scanResult.format === 'unknown') return;

    try {
      const upnQrData = parseUpnQr(scanResult.rawValue);
      const epcQrData = generateEpcQr(upnQrData);

      setEpcData(epcQrData);
      setIsScanning(false);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleReset = () => {
    setEpcData(null);
    setError(null);
    setIsScanning(true);
    setIsOpen(false);
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
              {epcData && <QRCode value={generateEpcQrString(epcData)} />}
              <Button onClick={handleReset} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Scan Another Code
              </Button>

              {epcData && (
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="w-full mt-4"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {isOpen ? 'Hide' : 'Show'} EPC Data
                      {isOpen ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <EpcQrDataDisplay data={epcData} />
                  </CollapsibleContent>
                </Collapsible>
              )}
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
