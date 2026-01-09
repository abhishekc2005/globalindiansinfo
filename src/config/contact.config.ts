export type CountryCode = "UK" | "INDIA";

export interface ContactInfo {
  phone: Record<CountryCode, string>;
}

export const CONTACT_INFO: ContactInfo = {
  phone: {
    UK: "+44-7867090363",
    INDIA: "+91-8792396989",
  },
};
