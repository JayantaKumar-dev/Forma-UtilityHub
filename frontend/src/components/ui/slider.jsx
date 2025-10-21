import * as React from "react";

export function Slider({ value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div className="w-full flex items-center space-x-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-yellow-400 cursor-pointer"
      />
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
