import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { Faculty } from "@/src/types";
import { FacultyService } from "@/src/lib/api/school-service";

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
  const res = await FacultyService.getAll();
  const data = res.data.data;

  return (
    <Select {...props}>
      {children}
      <SelectContent>
        {data.map((faculty) => {
          return (
            <SelectItem value={faculty.id ?? faculty.title} key={faculty.id}>
              {faculty.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
export default FacultySelect;
