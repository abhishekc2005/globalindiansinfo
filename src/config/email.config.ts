export type CountryCode = "UK" | "INDIA";

export interface ContactInfo {
  email: Record<CountryCode, string>;
}

export const EMAIL_INFO: ContactInfo = {
  email: {
    UK: "info@prabisha.com",
    INDIA: "info@prabisha.com",
  },
};
