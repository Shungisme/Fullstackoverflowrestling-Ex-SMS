import React from "react";
import { Select, SelectTrigger } from "./Select";
import { FacultyService } from "@/src/lib/api/school-service";
import ServerSelectOption from "../molecules/ServerSelectOption";

type FacultySelectProps = Omit<
    React.ComponentPropsWithoutRef<typeof Select>,
    "children"
> & {
    children: React.ReactElement<
        React.ComponentPropsWithoutRef<typeof SelectTrigger>
    >;
};
const FacultySelect = async ({ children, ...props }: FacultySelectProps) => {
    if (React.isValidElement(children) && children.type !== SelectTrigger) {
        throw new Error("FacultySelect only accepts SelectTrigger as children");
    }
   console.log("rerender");
    return (
        <Select {...props}>
            {children}
            <ServerSelectOption service={FacultyService} />
        </Select>
    );
};
export default FacultySelect;
