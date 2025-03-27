import { Input, Label } from "@repo/ui";
import { Address, FormErrors } from "../../types";

interface AddressFormProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  errors: FormErrors;
  errorKey: string;
}

export default function AddressForm({ address, onChange, errors, errorKey }: AddressFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${errorKey}-street`}>
          Số nhà, Tên đường <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${errorKey}-number`}
          value={address?.number || ''}
          onChange={(e) => onChange('number', e.target.value)}
          placeholder="Số nhà, tên đường"
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-district`}>
          Phường/Xã <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${errorKey}-street`}
          value={address?.street || ''}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Phường/Xã"
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-district`}>
          Quận/Huyện <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${errorKey}-district`}
          value={address?.district || ''}
          onChange={(e) => onChange('district', e.target.value)}
          placeholder="Quận/Huyện"
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-city`}>
          Tỉnh/Thành phố <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${errorKey}-city`}
          value={address?.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Tỉnh/Thành phố"
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${errorKey}-country`}>
          Quốc gia <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${errorKey}-country`}
          value={address?.country || ''}
          onChange={(e) => onChange('country', e.target.value)}
          placeholder="Quốc gia"
          className={errors[errorKey] ? "border-destructive" : ""}
        />
      </div>

      {errors[errorKey] && (
        <p className="text-xs text-destructive md:col-span-2">{errors[errorKey]}</p>
      )}
    </div>
  );
}
