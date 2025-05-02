import { LucideIcon } from "lucide-react";
import React from "react";

interface DataSectionProps {
  Icon: LucideIcon;
  title: string;
  description?: string | number;
}
const DataSection = ({ Icon, title, description }: DataSectionProps) => {
  return (
    <div className="flex items-start space-x-4">
      <Icon className="w-6 h-6 text-slate-500 mt-0.5" />
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-2">{title}</h3>
        <p className="text-slate-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default DataSection;
