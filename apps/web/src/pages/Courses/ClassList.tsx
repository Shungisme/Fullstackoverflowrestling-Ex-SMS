"use client";
import { Button } from "@/src/components/atoms/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/Select";
import { useLanguage } from "@/src/context/LanguageContext";
import React from "react";

const ClassList = () => {
    const { t } = useLanguage();
    return (
        <div className="">
            <div className="flex items-center justify-between mb-4">
                <Button>{t("ClassList_AddBtn")}</Button>
                <FilterBtn placeholder={t("ClassList_Filter")} options={[]} />
            </div>
        </div>
    );
};

export default ClassList;

function FilterBtn({
    placeholder,
    options,
}: {
    placeholder: string;
    options: { value: string; label: string }[];
}) {
    return (
        <Select>
            <SelectTrigger className="w-32">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all"></SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
