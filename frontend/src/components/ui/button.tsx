import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";
import withHapticFeedback from "~/components//hocs/withHapticFeedback";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-card hover:text-card-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-card hover:text-card-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-base",
        xs: "h-7 text-sm rounded-md px-3",
        sm: "h-10 text-sm rounded-md px-3",
        lg: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-10 w-10 rounded-full",
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

const Button = withHapticFeedback(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
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
  ),
  "light"
);
Button.displayName = "Button";

interface ConfirmButtonProps extends ButtonProps {
  onClick: () => void;
  children: React.ReactNode; // Текст по умолчанию берётся из children
}

const ConfirmButton = withHapticFeedback(
  React.forwardRef<HTMLButtonElement, ConfirmButtonProps>(
    ({ children, onClick, ...props }) => {
      const [clickCount, setClickCount] = React.useState(0);

      const handleClick = () => {
        if (clickCount === 2) {
          onClick(); // Третий клик, вызываем функцию onSubmit
          setClickCount(0); // Сбрасываем счётчик кликов
        } else {
          setClickCount(clickCount + 1); // Увеличиваем счётчик кликов
        }
      };

      const getButtonText = () => {
        switch (clickCount) {
          case 1:
            return "Are you sure?";
          case 2:
            return "Truly sure?";
          default:
            return children;
        }
      };

      return (
        <Button
          className="bg-card w-full text-destructive"
          onClick={handleClick}
          {...props}
        >
          {getButtonText()}
        </Button>
      );
    }
  ),
  "light"
);

export { Button, ConfirmButton, buttonVariants };
