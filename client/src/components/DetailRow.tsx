import React from "react";

interface DetailRowProps {
  label: React.ReactNode;
  value: string | React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b  py-2">
      <dt className="text-sm font-medium text-gray-600 flex items-center gap-1">
        {label}:
      </dt>
      <dd className="text-sm text-gray-800 mt-1 sm:mt-0 sm:text-right break-words">
        {value || <span className="text-gray-400 italic">N/A</span>}
      </dd>
    </div>
  );
};

export default DetailRow;
