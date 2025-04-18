"use client";
import React, { forwardRef, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "./Form";
import RequiredStar from "./RequiredStar";
import { Textarea } from "./Textarea";

interface TextareaInputFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
};

const TextareaInputField = forwardRef<HTMLTextAreaElement, TextareaInputFieldProps>(({
    label,
    placeholder,
    description,
    required = false,
    ...field
}, ref) => {
    return (
        <FormItem>
            <FormLabel>
                {label} {required && <RequiredStar />}
            </FormLabel>
            <FormControl>
                <Textarea
                    ref={ref}
                    placeholder={placeholder}
                    {...field}
                    className="overflow-hidden resize-none"
                />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
});

TextareaInputField.displayName = "TextareaInputField";

export default TextareaInputField;
