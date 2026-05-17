import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 text-sm text-app-foreground transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-app-foreground placeholder:text-app-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default:
          "h-10 rounded-md border border-app-border-strong bg-app-bg px-3 focus-visible:border-app-accent/50 focus-visible:ring-2 focus-visible:ring-app-accent/25",
        underline:
          "h-10 rounded-none border-0 border-b border-app-border bg-transparent px-0 shadow-none focus-visible:border-app-accent/50 focus-visible:ring-0",
        ghost:
          "h-10 rounded-md border-0 bg-transparent px-0 focus-visible:ring-0",
        search:
          "h-10 rounded-lg border border-app-border-strong bg-app-bg py-2.5 pl-10 pr-3 shadow-sm focus-visible:border-app-accent/50 focus-visible:ring-2 focus-visible:ring-app-accent/25",
      },
      inputSize: {
        default: "text-sm",
        lg: "h-12 px-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

function Input({
  className,
  variant,
  inputSize,
  type,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
