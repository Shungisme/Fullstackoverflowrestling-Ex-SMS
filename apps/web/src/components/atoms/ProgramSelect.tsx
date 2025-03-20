import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { Program } from "@/src/types";
import { ProgramService } from "@/src/lib/api/school-service";

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
  const res = await ProgramService.getAll();
  const data = res.data.data;

  return (
    <Select {...props}>
      {children}
      <SelectContent>
        {data.map((program) => {
          return (
            <SelectItem value={program.id ?? program.title} key={program.id}>
              {program.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
export default ProgramSelect;
