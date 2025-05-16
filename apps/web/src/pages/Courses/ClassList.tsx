"use client";
import { Button } from "@/src/components/atoms/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/Select";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { DataTable } from "@/src/components/molecules/DataTable";
import { useLanguage } from "@/src/context/LanguageContext";
import { ClassService } from "@/src/lib/api/school-service";
import { Class } from "@/src/types/course";
import { getErrorMessage } from "@/src/utils/helper";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ClassList = () => {
    const { t, language } = useLanguage();
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const service = new ClassService(language);
            const res = await service.getAll([`page=${page}`]);
            setClasses(res.data.data);
        } catch (e) {
            toast.error(getErrorMessage(e));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4">{t("ClassList_Title")}</h1>
            {isLoading ? <LoadingSpinner /> : <ClassTable data={classes} />}
        </div>
    );
};

export default ClassList;

function FilterBtn({
    placeholder,
    options,
}: {
    placeholder: string;
    options: { value: string; label: string }[];
}) {
    return (
        <Select>
            <SelectTrigger className="w-32">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all"></SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function ClassTable({ data }: { data: Class[] }) {
    const { t } = useLanguage();
    const columns: ColumnDef<Class>[] = [
        {
            accessorKey: "code",
            header: t("ClassList_ClassTable_Code"),
        },
        {
            accessorKey: "subject",
            header: t("ClassList_ClassTable_Subject"),
        },
        {
            accessorKey: "classroom",
            header: t("ClassList_ClassTable_Classroom"),
        },
    ];
    return <DataTable columns={columns} data={data} />;
}
