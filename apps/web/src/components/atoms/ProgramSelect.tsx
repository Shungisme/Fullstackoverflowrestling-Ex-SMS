import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { Program } from "@/src/types";

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
  //const res = await ProgramService.getAll();
  const data = mockData;

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

const mockData: Program[] = [
  {
    id: "1",
    title: "Bachelor of Computer Science",
    description:
      "A four-year program covering software development, algorithms, and data structures.",
    status: "Active",
  },
  {
    id: "2",
    title: "Master of Business Administration",
    description:
      "A postgraduate program focusing on leadership, finance, and marketing strategies.",
    status: "Active",
  },
  {
    id: "3",
    title: "Bachelor of Mechanical Engineering",
    description:
      "A program designed to teach students about mechanical design, thermodynamics, and manufacturing processes.",
    status: "Active",
  },
  {
    id: "4",
    title: "Doctor of Medicine",
    description:
      "A professional program that trains students to become medical doctors.",
    status: "Active",
  },
  {
    id: "5",
    title: "Diploma in Graphic Design",
    description:
      "A two-year diploma program covering digital and traditional graphic design techniques.",
    status: "Inactive",
  },
];
