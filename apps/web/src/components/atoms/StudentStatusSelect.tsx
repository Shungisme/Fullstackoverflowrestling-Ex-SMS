import React from "react";
import { Select, SelectTrigger } from "./Select";
import { StudentStatusService } from "@/src/lib/api/school-service";
import ServerSelectOption from "../molecules/ServerSelectOption";

type StudentStatusSelectProps = Omit<
    React.ComponentPropsWithoutRef<typeof Select>,
    "children"
> & {
    children: React.ReactElement<
        React.ComponentPropsWithoutRef<typeof SelectTrigger>
    >;
};
const StudentStatusSelect = async ({ children, ...props }: StudentStatusSelectProps) => {
    if (React.isValidElement(children) && children.type !== SelectTrigger) {
        throw new Error("StudentStatusSelect only accepts SelectTrigger as children");
    }

    return (
        <Select {...props}>
            {children}
            <ServerSelectOption service={StudentStatusService} />
        </Select>
    );
};
export default StudentStatusSelect;
