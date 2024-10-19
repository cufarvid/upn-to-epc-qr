type UpnQrData = {
  format: string;
  payer: {
    name: string;
    address: string;
    city: string;
  };
  payment: {
    amount: number;
    purposeCode: string;
    description: string;
    dueDate: string;
    iban: string;
    reference: string;
  };
  recipient: {
    name: string;
    address: string;
    city: string;
  };
  controlSum: number;
};

/**
 * Parse UPN QR code string into structured data
 * @param qrString Raw QR code data
 */
export const parseUpnQr = (qrString: string): UpnQrData => {
  const lines = qrString.trim().split('\n');

  // Validate control sum
  const expectedSum = lines
    .slice(0, 19)
    .reduce((sum, line) => sum + line.length, 19);
  const actualSum = parseInt(lines[19]);

  if (actualSum !== expectedSum) throw new Error('Invalid control sum');

  return {
    format: lines[0],
    payer: {
      name: lines[5].trim(),
      address: lines[6].trim(),
      city: lines[7].trim(),
    },
    payment: {
      amount: parseInt(lines[8]) / 100, // Convert cents to euros
      purposeCode: lines[11].trim(),
      description: lines[12].trim(),
      dueDate: lines[13].trim(),
      iban: lines[14].trim(),
      reference: lines[15].trim(),
    },
    recipient: {
      name: lines[16].trim(),
      address: lines[17].trim(),
      city: lines[18].trim(),
    },
    controlSum: parseInt(lines[19]),
  };
};

/**
 * Validate UPN QR data before generating EPC QR code
 * @param data UPN QR data
 */
const validateEpcQrInput = (data: UpnQrData) => {
  const errors: string[] = [];

  if (!data.recipient.name || data.recipient.name.length > 70) {
    errors.push(
      'Beneficiary name must be present and not exceed 70 characters',
    );
  }

  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(data.payment.iban.replace(/\s/g, ''))) {
    errors.push('Invalid IBAN format');
  }

  if (
    typeof data.payment.amount !== 'number' ||
    data.payment.amount <= 0 ||
    data.payment.amount > 999999999.99
  ) {
    errors.push(
      'Amount must be a positive number not exceeding 999,999,999.99',
    );
  }

  if (
    data.payment.purposeCode &&
    !/^[A-Z]{4}$/.test(data.payment.purposeCode)
  ) {
    errors.push('Purpose code must be 4 uppercase letters');
  }

  if (!data.payment.reference || data.payment.reference.length > 35) {
    errors.push('Reference must be present and not exceed 35 characters');
  }

  if (data.payment.description && data.payment.description.length > 140) {
    errors.push('Description must not exceed 140 characters');
  }

  return errors;
};

/**
 * Generate EPC QR code string from UPN QR data
 * @param data UPN QR data
 */
export const generateEpcQr = (data: UpnQrData): string => {
  const validationErrors = validateEpcQrInput(data);
  if (validationErrors.length > 0) {
    throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
  }

  const serviceTag = 'BCD';
  const version = '002';
  const encoding = '1';
  const identification = 'SCT';
  const bic = '';
  const recipient = data.recipient.name.toUpperCase().substring(0, 70);
  const iban = data.payment.iban.replace(/\s/g, '');
  const amount = data.payment.amount.toFixed(2);
  const purposeCode = (data.payment.purposeCode || '').substring(0, 4);
  const reference = data.payment.reference.substring(0, 35);
  const text = (data.payment.description || '').substring(0, 140);
  const info = '';

  const epcQRString = [
    serviceTag,
    version,
    encoding,
    identification,
    bic,
    recipient,
    iban,
    `EUR${amount}`,
    purposeCode,
    reference,
    text,
    info,
  ].join('\n');

  return epcQRString;
};
