import React from 'react';
import { Circle } from 'lucide-react';

const ColorOption = ({ color }: { color: string }) => {
  let finalColor = color;
  switch(color) {
    case 'black':
      finalColor = '#232421';
      break;
    case 'white':
      finalColor = '#e8f2d3';
      break;
    case 'blue':
      finalColor = '#5384d4';
      break;
    case 'yellow':
      finalColor = '#f5d547';
      break;
    case 'green':
      finalColor = '#53d46b';
      break;
    case 'red':
      finalColor = '#d45353';
      break;
    default:
  }

  return (
    <Circle strokeWidth="0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill={finalColor}
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </Circle>
  );
};

export default ColorOption;
