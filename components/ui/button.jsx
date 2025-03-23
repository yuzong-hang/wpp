import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  fetchUrl = "", // 接收 fetch API 的 URL
  fetchMethod = "POST", // 預設為 POST 方法
  fetchBody = {}, // 預設傳送的資料
  onFetchSuccess, // 請求成功時的回調
  onFetchError, // 請求錯誤時的回調
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  const handleClick = async () => {
    if (!fetchUrl) return;

    try {
      const response = await fetch(fetchUrl, {
        method: fetchMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fetchBody),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (onFetchSuccess) onFetchSuccess(data); // 執行成功回調
    } catch (error) {
      console.error("Fetch Error:", error);
      if (onFetchError) onFetchError(error);
    }
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={fetchUrl ? handleClick : props.onClick} // 如果有 fetchUrl，就用 handleClick
      {...props}
    />
  );
}

export { Button, buttonVariants };
