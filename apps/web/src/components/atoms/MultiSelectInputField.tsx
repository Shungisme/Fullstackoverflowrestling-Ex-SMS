import React from "react";
import { MultiSelect } from "./MultiSelect";
import { cn, Label } from "@repo/ui";
import RequiredStar from "./RequiredStar";

export interface MultiSelectInputFieldProps {
    label: string;
    placeholder: string;
    contents: {
        value: string;
        displayValue: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    required?: boolean;
    // These props come from react-hook-form's field: value, onChange, etc.
    value: string[];
    onChange: (value: string[]) => void;
    onBlur?: () => void;
    name?: string;
    className?: string;
}

/**
 * A multi-select input field component for use with react-hook-form.
 * Expects an array of options via `contents` and uses the `MultiSelect` component.
 */
export const MultiSelectInputField = React.forwardRef<
    HTMLButtonElement,
    MultiSelectInputFieldProps
>(
    (
        {
            label,
            placeholder,
            contents,
            required,
            value,
            onChange,
            onBlur,
            name,
            className,
            ...props
        },
        ref,
    ) => {
        // Map the contents prop to the options expected by MultiSelect
        const options = contents.map((item) => ({
            label: item.displayValue,
            value: item.value,
            icon: item.icon,
        }));

        return (
            <div className={cn("flex flex-col space-y-1", className)}>
                <Label htmlFor={name} className="text-sm font-medium">
                    {label} {required && <RequiredStar />}
                </Label>
                <MultiSelect
                    ref={ref}
                    options={options}
                    onValueChange={onChange}
                    defaultValue={value}
                    placeholder={placeholder}
                    {...props}
                />
                {/* Optionally, display errors or helper text here */}
            </div>
        );
    },
);

MultiSelectInputField.displayName = "MultiSelectInputField";
