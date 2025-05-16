// This component serve as a temporary fix for the add/edit form. Will be replace later
import { FormErrors, IdentityPapers, IdentityPaperType } from "@/src/types";
import { Input, Label } from "@repo/ui";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select";
import { Checkbox } from "../atoms/Checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { formatDate } from "date-fns";
import { useLanguage } from "@/src/context/LanguageContext";
import RequiredStar from "../atoms/RequiredStar";
import { getTypeString } from "@/src/utils/helper";

interface IdentityPaperFormV2Props {
  identityPaper: IdentityPapers;
  onChange: (field: keyof IdentityPapers, value: string | boolean) => void;
  errors: FormErrors;
  errorKey?: string;
}

const IdentityPaperFormV2 = ({
  identityPaper,
  onChange,
  errors,
}: IdentityPaperFormV2Props) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label htmlFor="type">{t("IdentityPaperForm_Type")}</Label>
        <Select
          name="type"
          onValueChange={(value: IdentityPaperType) => {
            onChange("type", value);
          }}
          value={identityPaper.type}
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
          {t("IdentityPaperForm_Number")} <RequiredStar />
        </Label>
        <Input
          name="number"
          value={identityPaper.number}
          onChange={(e) => onChange("number", e.target.value)}
          id="name"
          placeholder={`${t("IdentityPaperForm_NumberPlaceholder")} ${getTypeString(identityPaper.type)}`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueDate">{t("IdentityPaperForm_IssueDate")}</Label>
        <Input
          id="issueDate"
          name="issueDate"
          type="date"
          onChange={(e) => onChange("issueDate", e.target.value)}
          value={formatDate(identityPaper.issueDate, "yyyy-MM-dd")}
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
          value={formatDate(identityPaper.expirationDate, "yyyy-MM-dd")}
          onChange={(e) => onChange("expirationDate", e.target.value)}
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
          value={identityPaper.placeOfIssue}
          onChange={(e) => onChange("placeOfIssue", e.target.value)}
          className={errors.placeOfIssue && "border-destructive"}
        />
      </div>
      {identityPaper.type === "CCCD" && (
        <div className="flex items-center gap-4">
          <Label htmlFor="hasChip">{t("IdentityPaperForm_CCCD_HasChip")}</Label>
          <Checkbox
            id="hasChip"
            name="hasChip"
            onCheckedChange={(e: CheckedState) => {
              if (e !== "indeterminate") {
                onChange("hasChip", e);
              }
            }}
            checked={identityPaper.hasChip}
            className={errors.hasChip && "border-destructive"}
          />
        </div>
      )}

      {identityPaper.type === "PASSPORT" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="issuingCountry">
              {t("IdentityPaperForm_PASSPORT_Country")}
            </Label>
            <Input
              id="issuingCountry"
              name="issuingCountry"
              onChange={(e) => onChange("issuingCountry", e.target.value)}
              value={identityPaper.issuingCountry}
              className={errors.issuingCountry && "border-destructive"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t("IdentityPaperForm_PASSPORT_Note")}</Label>
            <Input
              id="note"
              name="note"
              onChange={(e) => onChange("note", e.target.value)}
              value={identityPaper.note}
              className={errors.note && "border-destructive"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IdentityPaperFormV2;
