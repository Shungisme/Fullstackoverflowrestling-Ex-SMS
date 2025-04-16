import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./Form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./Select";
import RequiredStar from "./RequiredStar";

type Content = {
    value: string;
    displayValue: string;
};

type SelectInputFieldProps = {
    label: string;
    placeholder?: string;
    contents: Content[];
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
};

const SelectInputField = ({
    label,
    placeholder,
    contents,
    value,
    onChange,
    required = false,
}: SelectInputFieldProps) => {
    return (
        <FormItem>
            <FormLabel>
                {label} {required && <RequiredStar />}
            </FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {contents.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.displayValue}
                        </SelectItem>
                    ))}
                </SelectContent>
                <FormMessage />
            </Select>
        </FormItem>
    );
};

export default SelectInputField;
