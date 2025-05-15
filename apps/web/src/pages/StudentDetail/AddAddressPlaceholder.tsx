import { Button } from "@/src/components/atoms/Button";
import { useLanguage } from "@/src/context/LanguageContext";
import { AddressService } from "@/src/lib/api/address-service";
import { AddressType } from "@/src/types";
import { MapPin, Pencil } from "lucide-react";
import React from "react";
import AddressTypeName from "./AddressTypeName";

type AddAddressPlaceholderProps = {
    openAddressDialog: (type: AddressType, action: "add" | "edit") => void;
    type: AddressType;
};

const AddAddressPlaceholder = ({
    openAddressDialog,
    type,
}: AddAddressPlaceholderProps) => {
    const {t} = useLanguage();
    return (
        <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-muted-foreground" />
                {<AddressTypeName type={type} />}
            </h4>
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 p-3 border-dashed"
                onClick={() => openAddressDialog(type, "add")}
            >
                <Pencil size={14} />
                {t("addBtn")} {<AddressTypeName type={type} />}
            </Button>
        </div>
    );
};

export default AddAddressPlaceholder;
