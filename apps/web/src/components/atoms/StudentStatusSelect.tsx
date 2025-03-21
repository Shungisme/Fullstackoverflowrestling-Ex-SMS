import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { StudentStatusService } from "@/src/lib/api/school-service";

type StudentStatusSelectProps = Omit<
  React.ComponentPropsWithoutRef<typeof Select>,
  "children"
> & {
  children: React.ReactElement<
    React.ComponentPropsWithoutRef<typeof SelectTrigger>
  >;
};
const StudentStatusSelect = async ({
  children,
  ...props
}: StudentStatusSelectProps) => {
  if (React.isValidElement(children) && children.type !== SelectTrigger) {
    throw new Error("FacultySelect only accepts SelectTrigger as children");
  }
  const res = await StudentStatusService.getAll();
  const data = res.data.data;

  return (
    <Select {...props}>
      {children}
      <SelectContent>
        {data.map((item) => {
          return (
            <SelectItem value={item.id ?? item.title} key={item.id}>
              {item.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
export default StudentStatusSelect;
