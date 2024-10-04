import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "sm:h-8 sm:w-8 w-5 h-5 rounded-md sm:px-1.5 px-1 text-xs",
        md: "sm:h-8 h-6 rounded-md sm:px-2 px-1.5 sm:py-1 py-0.5 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-5 w-5 p-2",
        mini: "h-6 w-6 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface NavButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  popoverContent?: React.ReactNode;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon,
  onClick,
  popoverContent,
  className,
}) => {
  const buttonContent = (
    <Button size="sm" variant="ghost" className={className}>
      {icon}
    </Button>
  );

  if (popoverContent) {
    return (
      <Popover>
        <PopoverTrigger asChild>{buttonContent}</PopoverTrigger>
        <PopoverContent className="mr-5">{popoverContent}</PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onClick ?? undefined}
      className={className}
    >
      {icon}
    </Button>
  );
};

export { Button, buttonVariants, NavButton };
