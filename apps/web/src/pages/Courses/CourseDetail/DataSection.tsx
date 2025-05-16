import React from "react";

interface DataSectionProps {
  icon: React.JSX.Element;
  title: string;
  description?: string | number;
}
const DataSection = ({ icon, title, description }: DataSectionProps) => {
  return (
    <div className="flex items-start space-x-4">
      {icon}
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-2">{title}</h3>
        <p className="text-slate-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default DataSection;
