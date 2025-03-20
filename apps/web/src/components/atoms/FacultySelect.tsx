import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./Select";
import { Faculty } from "@/src/types";

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
  //const res = await FacultyService.getAll();
  const data = mockData;

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

const mockData: Faculty[] = [
  {
    id: "1",
    title: "Computer Science",
    description:
      "The faculty focuses on software development, artificial intelligence, and data science.",
    status: "Active",
  },
  {
    id: "2",
    title: "Business Administration",
    description:
      "This faculty offers programs in management, finance, and marketing.",
    status: "Inactive",
  },
  {
    id: "3",
    title: "Mechanical Engineering",
    description:
      "Covers design, manufacturing, and maintenance of mechanical systems.",
    status: "Active",
  },
  {
    id: "4",
    title: "Medicine",
    description:
      "Provides medical training and research in healthcare sciences.",
    status: "Active",
  },
  {
    id: "5",
    title: "Fine Arts",
    description:
      "Focuses on creative disciplines such as painting, sculpture, and digital arts.",
    status: "Inactive",
  },
];
