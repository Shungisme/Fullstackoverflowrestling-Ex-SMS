import React from "react";
import { Select, SelectTrigger } from "./Select";
import { ProgramService } from "@/src/lib/api/school-service";
import ServerSelectOption from "../molecules/ServerSelectOption";

type ProgramSelectProps = Omit<
    React.ComponentPropsWithoutRef<typeof Select>,
    "children"
> & {
    children: React.ReactElement<
        React.ComponentPropsWithoutRef<typeof SelectTrigger>
    >;
};
const ProgramSelect = async ({ children, ...props }: ProgramSelectProps) => {
    if (React.isValidElement(children) && children.type !== SelectTrigger) {
        throw new Error("ProgramSelect only accepts SelectTrigger as children");
    }

    return (
        <Select {...props}>
            {children}
            <ServerSelectOption service={ProgramService} />
        </Select>
    );
};
export default ProgramSelect;
