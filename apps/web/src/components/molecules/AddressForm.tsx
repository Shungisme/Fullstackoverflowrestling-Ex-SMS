"use client";
import { Input, Label } from "@repo/ui";
import { Address, FormErrors } from "../../types";
import { useLanguage } from "@/src/context/LanguageContext";
import RequiredStar from "../atoms/RequiredStar";

interface AddressFormProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  errors: FormErrors;
  errorKey: string;
}

export default function AddressForm({
  address,
  onChange,
  errors,
  errorKey,
}: AddressFormProps) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${errorKey}-street`}>
          {t("AddressForm_Number")} <RequiredStar />
        </Label>
        <Input
          id={`${errorKey}-number`}
          value={address?.number || ""}
          onChange={(e) => onChange("number", e.target.value)}
          placeholder={t("AddressForm_NumberPlaceholder")}
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-district`}>
          {t("AddressForm_Street")} <RequiredStar />
        </Label>
        <Input
          id={`${errorKey}-street`}
          value={address?.street || ""}
          onChange={(e) => onChange("street", e.target.value)}
          placeholder={t("AddressForm_StreetPlaceholder")}
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-district`}>
          {t("AddressForm_District")} <RequiredStar />
        </Label>
        <Input
          id={`${errorKey}-district`}
          value={address?.district || ""}
          onChange={(e) => onChange("district", e.target.value)}
          placeholder={t("AddressForm_DistrictPlaceholder")}
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-city`}>
          {t("AddressForm_City")} <RequiredStar />
        </Label>
        <Input
          id={`${errorKey}-city`}
          value={address?.city || ""}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder={t("AddressForm_CityPlaceholder")}
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-country`}>
          {t("AddressForm_Country")} <RequiredStar />
        </Label>
        <Input
          id={`${errorKey}-country`}
          value={address?.country || ""}
          onChange={(e) => onChange("country", e.target.value)}
          placeholder={t("AddressForm_CountryPlaceholder")}
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      {errors[errorKey] && (
        <p className="text-xs text-destructive md:col-span-2">
          {errors[errorKey]}
        </p>
      )}
    </div>
  );
}
