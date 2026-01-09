import {EMAIL_INFO , CountryCode} from "@/config/email.config";

export const getEmail = (country: CountryCode): string => {
  return EMAIL_INFO.email[country];
};
