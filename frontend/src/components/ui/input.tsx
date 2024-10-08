import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

Input.displayName = "Input";

interface AdornedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: string;
  urlPattern?: RegExp;
}

const AdornedInput = React.forwardRef<HTMLInputElement, AdornedInputProps>(
  ({ startAdornment, urlPattern, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
      let value = input.value;
      if (urlPattern) {
        value = value.replace(urlPattern, "");
      }
      input.value = value;
      if (props.onChange) {
        const changeEvent = new Event("input", {
          bubbles: true,
        }) as unknown as React.ChangeEvent<HTMLInputElement>;
        Object.defineProperty(changeEvent, "target", {
          writable: false,
          value: input,
        });
        Object.defineProperty(changeEvent, "currentTarget", {
          writable: false,
          value: input,
        });
        props.onChange(changeEvent);
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const input = event.target as HTMLInputElement;
      let value = pastedText;
      if (urlPattern) {
        value = pastedText.replace(urlPattern, "");
      }
      input.value = value;
      if (props.onChange) {
        // Manually create a change event
        const changeEvent = new Event("input", {
          bubbles: true,
        }) as unknown as React.ChangeEvent<HTMLInputElement>;
        Object.defineProperty(changeEvent, "target", {
          writable: false,
          value: input,
        });
        Object.defineProperty(changeEvent, "currentTarget", {
          writable: false,
          value: input,
        });
        props.onChange(changeEvent);
      }
    };

    return (
      <label
        className={`flex items-center bg-card border-input rounded-2xl ring-offset-background ${
          isFocused
            ? "outline-none border-primary ring-2 ring-ring ring-offset-2"
            : "border-input"
        }`}
      >
        <span className="px-3 text-muted-foreground select-none text-sm">
          {startAdornment}
        </span>
        <div className="flex-1 overflow-hidden rounded-md">
          <Input
            ref={ref}
            {...props}
            className="flex-1 bg-transparent border-none pl-0 ring-0 rounded-none focus:border-none focus-visible:ring-0 focus-visible:border-none focus:outline-0 focus-visible:shadow-none "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            onInput={handleValueChange} // Listen for input events
            onChange={handleValueChange} // Listen for change events
          />
        </div>
      </label>
    );
  }
);

AdornedInput.displayName = "AdornedInput";

export { Input, AdornedInput };
