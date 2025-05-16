
"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Language } from "@/src/constants/constants";

export function LanguageToggle() {
    const { language, setLanguageHandler, t } = useLanguage();

    return (
        <Select defaultValue={language} onValueChange={(value: Language) => setLanguageHandler(value)}>
            <SelectTrigger>
                <SelectValue placeholder={t("language")} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={Language.VIETNAMESE} className="flex items-center">
                    <span className="mr-2">🇻🇳</span>
                    {"Tiếng Việt"}
                </SelectItem>
                <SelectItem value={Language.ENGLISH} className="flex items-center">
                    <span className="mr-2">🇺🇸</span>
                    {"English"}
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
