import React, {
  ChangeEventHandler,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Input } from "@repo/ui";
import RequiredStar from "./RequiredStar";

interface NumberInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: number;
}

const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  (
    {
      label,
      placeholder,
      required = false,
      description,
      onChange,
      value,
      ...field
    },
    ref,
  ) => {
    return (
      <FormItem>
        <FormLabel>
          {label} {required && <RequiredStar />}
        </FormLabel>
        <FormControl>
          <Input
            ref={ref}
            value={value ?? ""}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (isNaN(newValue)) {
                return;
              } else if (onChange) {
                onChange(e);
              }
            }}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  },
);

NumberInputField.displayName = "NumberInputField";

export default NumberInputField;
