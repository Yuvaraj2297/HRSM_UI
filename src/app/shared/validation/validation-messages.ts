export const VALIDATION_MESSAGES = {
  required: '{field} is required',
  minlength: '{field} must be at least {value} characters',
  maxlength: '{field} maximum length exceeded',
  alphabetOnly: '{field} cannot contain numbers or special characters.',
  currencyOnly: '{field} cannot contain Alphabet or special characters.',
  invalidFormat: 'Invalid {field} format',
  email: 'Enter a valid {field}',
  phoneNumber: '{field} must be exactly 10 digits',
  indianPhoneNumber: 'Enter a valid Indian mobile number',
  panNumber: 'Enter a valid PAN Number (e.g. ABCDE1234F)',
  postalNumber: 'Enter a valid speed post number (e.g. EE123456789IN)',
  duplicate: '{field} already exists',
  nameFormat: 'Only alphabets, spaces and one dot (.) are allowed.',
  nameInvalidFormat: '{field} cannot contain numbers or special characters.',
  numberOnly: '{field} can contain only numbers.',
  ifscLength: '{field} must be exactly 11 characters.',
  ifscFormat: 'Enter a valid IFSC (e.g.SBIN0001234).',
  accountNumber: 'Enter a valid AccountNumber'

} as const;