import React from 'react';
import { Circle } from 'lucide-react';

const ColorOption = ({ color }: { color: string }) => {
  return (
    <Circle strokeWidth="0.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill={color}
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </Circle>
  );
};

export default ColorOption;
