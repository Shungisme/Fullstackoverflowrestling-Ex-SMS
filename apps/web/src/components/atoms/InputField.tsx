import React, { forwardRef, InputHTMLAttributes } from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Input } from "@repo/ui";
import RequiredStar from "./RequiredStar";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, description, required = false, ...fields }, ref) => {
    return (
      <FormItem>
        <FormLabel>
          {label} {required && <RequiredStar />}
        </FormLabel>
        <FormControl>
          <Input ref={ref} placeholder={placeholder} {...fields} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
