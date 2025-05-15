import { useLanguage } from "../context/LanguageContext";
import { IdentityPaperType } from "../types";

export function toQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}

export function getTypeString(type: IdentityPaperType | string) {
  const { t } = useLanguage();
  switch (type) {
    case "CMND":
      return t("IdentityPaperType_CMND");
    case "CCCD":
      return t("IdentityPaperType_CCCD");
    case "PASSPORT":
      return t("IdentityPaperType_PASSPORT");
    default:
      break;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}