import { Card, CardContent } from '@/components/ui/card';
import { type EpcQrData } from '@/lib/qr';

const fieldNameMap: Record<keyof EpcQrData, string> = {
  serviceTag: 'Service Tag',
  version: 'Version',
  encoding: 'Character set',
  identification: 'Identification',
  bic: 'BIC',
  recipient: 'Name',
  iban: 'IBAN',
  amount: 'Amount',
  purposeCode: 'Purpose',
  reference: 'Reference',
  text: 'Text',
  info: 'Information',
};

interface EpcQrDataDisplayProps {
  data: EpcQrData;
}

export function EpcQrDataDisplay({ data }: EpcQrDataDisplayProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <dl className="space-y-2 text-sm">
          {(Object.keys(data) as Array<keyof EpcQrData>).map((key) => (
            <div key={key} className="flex">
              <dt className="font-semibold w-1/3">{fieldNameMap[key]}:</dt>
              <dd className="w-2/3">{data[key]}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
