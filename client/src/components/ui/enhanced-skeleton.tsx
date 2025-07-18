import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "pulse" | "wave" | "shimmer";
  lines?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
  animate?: boolean;
  children?: ReactNode;
}

function EnhancedSkeleton({
  className,
  variant = "shimmer",
  lines = 1,
  height = "h-4",
  width = "w-full",
  rounded = true,
  animate = true,
  children,
  ...props
}: EnhancedSkeletonProps) {
  const baseClasses = cn(
    "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
    rounded && "rounded-md",
    height,
    width,
    !children && "block",
    className
  );

  const animationClasses = {
    default: "animate-pulse",
    pulse: "animate-pulse",
    wave: "animate-wave",
    shimmer: "animate-shimmer"
  };

  if (children) {
    return (
      <div className={cn(baseClasses, animate && animationClasses[variant])} {...props}>
        <div className="invisible">{children}</div>
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              animate && animationClasses[variant],
              i === lines - 1 && "w-3/4" // Make last line shorter
            )}
            style={{
              animationDelay: animate ? `${i * 0.1}s` : "0s"
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        animate && animationClasses[variant]
      )}
      {...props}
    />
  );
}

export { EnhancedSkeleton };
