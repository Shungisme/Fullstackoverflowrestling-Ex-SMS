import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { StudentStatus } from "@/src/types";

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
  //const res = await StudentStatusService.getAll();
  const data = mockData;

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

const mockData: StudentStatus[] = [
    {
    id: "1",
    title: "Enrolled",
    description: "The student is actively enrolled in the institution.",
    status: "Active",
  },
  {
    id: "2",
    title: "Graduated",
    description: "The student has successfully completed their program.",
    status: "Inactive",
  },
  {
    id: "3",
    title: "On Leave",
    description: "The student is temporarily on leave for personal or academic reasons.",
    status: "Inactive",
  },
  {
    id: "4",
    title: "Dropped Out",
    description: "The student has left the institution before completing their program.",
    status: "Inactive",
  },
  {
    id: "5",
    title: "Expelled",
    description: "The student was dismissed due to academic or disciplinary reasons.",
    status: "Inactive",
  },
];
