"use client";
import { useLanguage } from "@/src/context/LanguageContext";
import { AddressType } from "@/src/types";

export default function AddressTypeName({ type } : { type: AddressType }) {
    const {t} = useLanguage();
    const typeMap: Record<AddressType, string> = {
        "mailingAddress": t("AddressTypeName_Mailing"),
        "permanentAddress": t("AddressTypeName_Permanent"),
        "temporaryAddress": t("AddressTypeName_Temporary"),
    };
    const typeName = typeMap[type] || "";
    return <p>{typeName}</p>
}