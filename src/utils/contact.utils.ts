import { CONTACT_INFO, CountryCode } from "@/config/contact.config";

export const getPhoneNumber = (country: CountryCode): string => {
  return CONTACT_INFO.phone[country];
};
