import React from "react";

export default function DividerWithLabels({ leftLabel, rightLabel }) {
  return (
    <div className="flex items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="mx-2 text-gray-500">{leftLabel}</div>
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="mx-2 text-gray-500">{rightLabel}</div>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
