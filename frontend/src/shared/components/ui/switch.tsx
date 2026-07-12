import * as React from "react"
import { cn } from "../../lib/utils"

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
      <div
        className={cn(
          "w-11 h-6 bg-muted border-2 border-transparent rounded-full peer peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 peer-focus:ring-offset-background transition-colors",
          "peer-checked:bg-primary",
          "after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white",
          className
        )}
      ></div>
    </label>
  )
)
Switch.displayName = "Switch"

export { Switch }
