import { FormErrors, IdentityPapers } from "@/src/types";
import { Input, Label } from "@repo/ui";
import React, { useState } from "react";
import { Checkbox } from "../atoms/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "../atoms/Button";
import { IdentityPaperType } from "@/src/types";
import { formatDate } from "date-fns";
import { useLanguage } from "@/src/context/LanguageContext";
import { getTypeString } from "@/src/utils/helper";

interface IdentityPaperFormProps {
  initial?: IdentityPapers;
  onSubmit: (value: IdentityPapers) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const initialValue: IdentityPapers = {
  type: "CMND",
  number: "",
  issueDate: "",
  expirationDate: "",
  placeOfIssue: "",
};

const IdentityPaperForm = ({
  initial = initialValue,
  onSubmit,
  isSubmitting,
}: IdentityPaperFormProps) => {
  const [formData, setFormData] = useState<IdentityPapers>({
    ...initial,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const changeType = (type: IdentityPaperType) => {
    setFormData({
      ...formData,
      type,
    });
  };
  const { t } = useLanguage();
  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">{t("IdentityPaperForm_Type")}</Label>
        <Select
          name="type"
          value={formData.type}
          onValueChange={(value: IdentityPaperType) => changeType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={t("IdentityPaperForm_TypePlaceholder")}
              defaultValue="CCCD"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CMND">{getTypeString("CMND")}</SelectItem>
            <SelectItem value="CCCD">{getTypeString("CCCD")}</SelectItem>
            <SelectItem value="PASSPORT">
              {getTypeString("PASSPORT")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">
          {t("IdentityPaperForm_Number")}{" "}
          <span>{getTypeString(formData.type)}</span>
        </Label>
        <Input
          name="number"
          value={formData.number}
          onChange={handleChange}
          id="name"
          placeholder={`${t("IdentityPaperForm_NumberPlaceholder")} ${getTypeString(formData.type)}`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueDate">{t("IdentityPaperForm_IssueDate")}</Label>
        <Input
          id="issueDate"
          name="issueDate"
          type="date"
          value={formatDate(formData.issueDate, "yyyy-MM-dd")}
          className={errors.issueDate && "border-destructive"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expirationDate">
          {t("IdentityPaperForm_ExpiryDate")}
        </Label>
        <Input
          id="expirationDate"
          name="expirationDate"
          type="date"
          value={formatDate(formData.expirationDate, "yyyy-MM-dd")}
          className={errors.expirationDate && "border-destructive"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placeOfIssue">
          {t("IdentityPaperForm_PlaceOfIssue")}
        </Label>
        <Input
          id="placeOfIssue"
          name="placeOfIssue"
          value={formData.placeOfIssue}
          className={errors.placeOfIssue && "border-destructive"}
        />
      </div>
      {formData.type === "CCCD" && (
        <div className="flex items-center gap-4">
          <Label htmlFor="hasChip">{t("IdentityPaperForm_CCCD_HasChip")}</Label>
          <Checkbox
            id="hasChip"
            name="hasChip"
            onCheckedChange={(e: CheckedState) => {
              if (e !== "indeterminate") {
                setFormData({
                  ...formData,
                  hasChip: e,
                });
              }
            }}
            checked={formData.hasChip}
            className={errors.hasChip && "border-destructive"}
          />
        </div>
      )}

      {formData.type === "PASSPORT" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="issuingCountry">
              {t("IdentityPaperForm_PASSPORT_Country")}
            </Label>
            <Input
              id="issuingCountry"
              name="issuingCountry"
              onChange={handleChange}
              value={formData.issuingCountry}
              className={errors.issuingCountry && "border-destructive"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t("IdentityPaperForm_PASSPORT_Note")}</Label>
            <Input
              id="note"
              name="note"
              onChange={handleChange}
              value={formData.note}
              className={errors.note && "border-destructive"}
            />
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2 mt-6">
        <Button disabled={isSubmitting}>
          {isSubmitting
            ? t("IdentityPaperForm_SubmitButton_Submiting")
            : initial
              ? t("IdentityPaperForm_SubmitButton_Edit")
              : t("IdentityPaperForm_SubmitButton_Add")}
        </Button>
      </div>
    </form>
  );
};

export default IdentityPaperForm;
