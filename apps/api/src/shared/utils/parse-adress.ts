export const parseAddress = (addressString: string): any => {
  const parts = addressString.split(', ');
  return {
    number: parts[0].trim(),
    street: parts[1].trim(),
    district: parts[2].trim(),
    city: parts[3].trim(),
    country: parts[4].trim() || 'Vietnam',
  };
};
export const validFields = {
  permanentAddress: 'permanentAddressId',
  temporaryAddress: 'temporaryAddressId',
  mailingAddress: 'mailingAddressId',
} as const;

export const formatAddress = (address: any): string => {
  if (!address) return '';

  const { number, street, district, city, country } = address;

  return [number || '', street || '', district || '', city || '', country || '']
    .filter(Boolean)
    .join(', ');
};

export const formatIdentityPaper = (paper: any): string => {
  if (!paper) return '';

  const {
    type,
    number,
    issueDate,
    expirationDate,
    placeOfIssue,
    hasChip,
    issuingCountry,
    notes,
  } = paper;

  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString()
    : '';
  const formattedExpiryDate = expirationDate
    ? new Date(expirationDate).toLocaleDateString()
    : '';

  return [
    `Type: ${type || ''}`,
    `Number: ${number || ''}`,
    formattedIssueDate ? `Issue Date: ${formattedIssueDate}` : '',
    formattedExpiryDate ? `Expiry: ${formattedExpiryDate}` : '',
    placeOfIssue ? `Place: ${placeOfIssue}` : '',
    issuingCountry ? `Country: ${issuingCountry}` : '',
    notes ? `Notes: ${notes}` : '',
  ]
    .filter(Boolean)
    .join(', ');
};
