import React from "react";

export function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors ${
            checked ? "bg-yellow-400" : "bg-gray-400"
          }`}
        ></div>
        <div
          className={`dot absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        ></div>
      </div>
      {label && <span className="text-sm text-white">{label}</span>}
    </label>
  );
}
