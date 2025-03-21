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

type IdentityPaperType = "CMND" | "CCCD" | "passport";

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

const getTypeString = (type: IdentityPaperType | string) => {
  switch (type) {
    case "CMND":
      return "Chứng minh nhân dân";
    case "CCCD":
      return "Căn cước công dân";
    case "passport":
      return "Hộ chiếu";
    default:
      break;
  }
};

const IdentityPaperForm = ({
  initial = initialValue,
  onSubmit,
  onCancel,
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

  return (
    <form className="space-y-2">
      <div className="space-y-2">
        <Label htmlFor="name">
          Số <span>{getTypeString(formData.type)}</span>
        </Label>
        <Select
          name="type"
          onValueChange={(value: IdentityPaperType) => changeType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại giấy tờ" defaultValue="CCCD" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CMND">{getTypeString("CMND")}</SelectItem>
            <SelectItem value="CCCD">{getTypeString("CCCD")}</SelectItem>
            <SelectItem value="passport">
              {getTypeString("passport")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">
          Số <span>{getTypeString(formData.type)}</span>
        </Label>
        <Input
          name="number"
          value={formData.number}
          onChange={handleChange}
          id="name"
          placeholder={`Nhập số ${getTypeString(formData.type)}`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueDate">Ngày cấp</Label>
        <Input
          id="issueDate"
          name="issueDate"
          type="date"
          value={formData.issueDate}
          className={errors.issueDate && "border-destructive"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expirationDate">Ngày hết hạn</Label>
        <Input
          id="expirationDate"
          name="expirationDate"
          type="date"
          value={formData.expirationDate}
          className={errors.expirationDate && "border-destructive"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placeOfIssue">Nơi cấp</Label>
        <Input
          id="placeOfIssue"
          name="placeOfIssue"
          value={formData.placeOfIssue}
          className={errors.placeOfIssue && "border-destructive"}
        />
      </div>
      {formData.type === "CCCD" && (
        <div className="flex items-center gap-4">
          <Label htmlFor="hasChip">Có chip</Label>
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

      {formData.type === "passport" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="issuingCountry">Quốc gia cấp</Label>
            <Input
              id="issuingCountry"
              name="issuingCountry"
              onChange={handleChange}
              value={formData.issuingCountry}
              className={errors.issuingCountry && "border-destructive"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
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
            ? "Saving..."
            : initial
              ? "Update Document"
              : "Add Document"}
        </Button>
      </div>
    </form>
  );
};

export default IdentityPaperForm;
