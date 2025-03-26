"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import useSchoolConfig from "../hooks/useSchoolConfig";

type SchoolConfigContextType = {
    faculties: Faculty[];
    statuses: StudentStatus[];
    programs: Program[];
};

const SchoolConfigContext = createContext<SchoolConfigContextType | undefined>(
    undefined,
);

type SchoolConfigProviderProps = {
    children: ReactNode;
};

export function SchoolConfigProvider({ children }: SchoolConfigProviderProps) {
    const { faculties, statuses, programs } = useSchoolConfig();

    const value = useMemo(
        () => ({
            faculties,
            statuses,
            programs,
        }),
        [faculties, statuses, programs],
    );

    return (
        <SchoolConfigContext.Provider value={value}>
            {children}
        </SchoolConfigContext.Provider>
    );
}

export function useSchoolConfigContext() {
    const context = useContext(SchoolConfigContext);
    if (context === undefined) {
        throw new Error(
            "useSchoolConfigContext must be used within a SchoolConfigProvider",
        );
    }
    return context;
}
