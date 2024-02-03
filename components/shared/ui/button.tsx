import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    variant: {
      primary: [
        "bg-blue-500",
        "text-white",
        "border-transparent",
        "hover:bg-blue-600",
      ],
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
  },
  compoundVariants: [{ variant: "primary", size: "medium", class: "uppercase" }],
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<React.ComponentRef<'button'>, ButtonProps>(
  ({
    className,
    variant,
    size,
    ...props
  }, ref) =>
    <button
      className={button({ variant, size, className })}
      ref={ref}
      {...props}
    />
);

Button.displayName = "Button"