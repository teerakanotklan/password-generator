"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  hideScrollbar?: boolean
}

function ScrollArea({
  className,
  children,
  hideScrollbar = false,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "overflow-y-auto",
        hideScrollbar && "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ScrollBar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return null
}

export { ScrollArea, ScrollBar }

