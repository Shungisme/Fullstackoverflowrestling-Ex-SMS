import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/atoms/Avatar";
import { Badge } from "@/src/components/atoms/Badge";
import { Student } from "@/src/types";
import { School, User } from "lucide-react";
import React from "react";

interface HeaderSectionProps {
  student: Student;
}

const getInitials = (name: string) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || ""
  );
};

const HeaderSection = ({ student }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${student?.name}`}
            alt={student?.name}
          />
          <AvatarFallback>{getInitials(student?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{student?.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <User size={16} />
              ID: {student?.studentId}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              <School size={16} />
              {student?.faculty?.title}
            </span>
          </div>
        </div>
      </div>
      <Badge className="text-xs py-1 px-3">{student?.status?.title}</Badge>
    </div>
  );
};

export default HeaderSection;
