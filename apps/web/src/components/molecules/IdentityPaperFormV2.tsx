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

interface IdentityPaperFormV2Props {
    identityPaper: IdentityPapers;
    onChange: (field: keyof IdentityPapers, value: string | boolean) => void;
    errors: FormErrors;
    errorKey?: string;
}

const getTypeString = (type: IdentityPaperType | string) => {
    switch (type) {
        case "CMND":
            return "Chứng minh nhân dân";
        case "CCCD":
            return "Căn cước công dân";
        case "PASSPORT":
            return "Hộ chiếu";
        default:
            break;
    }
};

const IdentityPaperFormV2 = ({
    identityPaper,
    onChange,
    errors,
    errorKey,
}: IdentityPaperFormV2Props) => {
    return (
        <div className="space-y-2">
            <div className="space-y-2">
                <Label htmlFor="type">Chọn loại giấy tờ</Label>
                <Select
                    name="type"
                    onValueChange={(value: IdentityPaperType) => {
                        onChange("type", value);
                    }}
                    value={identityPaper.id}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại giấy tờ" defaultValue="CCCD" />
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
                    Số <span>{getTypeString(identityPaper.type)}</span>
                </Label>
                <Input
                    name="number"
                    value={identityPaper.number}
                    onChange={(e) => onChange("number", e.target.value)}
                    id="name"
                    placeholder={`Nhập số ${getTypeString(identityPaper.type)}`}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="issueDate">Ngày cấp</Label>
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
                <Label htmlFor="expirationDate">Ngày hết hạn</Label>
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
                <Label htmlFor="placeOfIssue">Nơi cấp</Label>
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
                    <Label htmlFor="hasChip">Có chip</Label>
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
                        <Label htmlFor="issuingCountry">Quốc gia cấp</Label>
                        <Input
                            id="issuingCountry"
                            name="issuingCountry"
                            onChange={(e) => onChange("issuingCountry", e.target.value)}
                            value={identityPaper.issuingCountry}
                            className={errors.issuingCountry && "border-destructive"}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú</Label>
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
