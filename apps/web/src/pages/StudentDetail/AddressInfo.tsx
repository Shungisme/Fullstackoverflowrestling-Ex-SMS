import { MapPin, Pencil } from "lucide-react";
import { Address, AddressType } from "@/src/types";
import React from "react";
import { Button } from "@/src/components/atoms/Button";
import { useLanguage } from "@/src/context/LanguageContext";
import AddressTypeName from "./AddressTypeName";

interface AddressInfoProps {
  type: AddressType;
  openAddressDialog: (type: AddressType, action: "add" | "edit") => void;
  address: Address;
}

const AddressInfo = ({
  type,
  openAddressDialog,
  address,
}: AddressInfoProps) => {
  const {t} = useLanguage();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MapPin size={16} className="text-muted-foreground" />
          {<AddressTypeName type={type} />}
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => openAddressDialog(type, "edit")}
        >
          <Pencil size={14} className="mr-1" />
          {t("editBtn")}
        </Button>
      </div>
      <div className="bg-muted p-3 rounded-md text-sm">
        {address?.number} {address?.street},
        <br />
        {address?.district}, {address?.city},
        <br />
        {address?.country}
      </div>
    </div>
  );
};

export default AddressInfo;
