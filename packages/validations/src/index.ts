/**
 * Validates email format
 * @param email - The email to validate
 * @returns Whether the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const allowedEmailDomains = ["student.university.edu.vn"];
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (
    re.test(String(email).toLowerCase()) &&
    allowedEmailDomains.some((domain) => email.endsWith(domain))
  );
};

/**
 * Validates phone number format (Vietnamese phone number format)
 * @param phone - The phone number to validate
 * @returns Whether the phone number is valid
 */
export const validatePhone = (phone: string): boolean => {
  // Vietnamese phone numbers typically start with 0, followed by 9 digits
  const re = /^(0|\+84)([3|5|7|8|9])([0-9]{8})$/;
  return re.test(String(phone).replace(/\s/g, ""));
};

/**
 * Validates required fields
 * @param value - The value to check
 * @returns Whether the value is not empty
 */
export const validateRequired = (value: string | undefined | null): boolean => {
  return !!value && value.trim() !== "";
};
