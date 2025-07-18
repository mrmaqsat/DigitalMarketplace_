import { cn } from "@/lib/utils";
import { EnhancedSkeleton } from "./enhanced-skeleton";

interface ProductCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "grid" | "list";
  showButton?: boolean;
  animationDelay?: number;
}

function ProductCardSkeleton({ 
  className,
  variant = "grid",
  showButton = true,
  animationDelay = 0,
  ...props 
}: ProductCardSkeletonProps) {
  const baseClasses = cn(
    "bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in",
    className
  );

  const containerStyle = {
    animationDelay: `${animationDelay}s`
  };

  if (variant === "list") {
    return (
      <div className={cn(baseClasses, "p-6")} style={containerStyle} {...props}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <EnhancedSkeleton 
              className="w-full sm:w-48 h-32 rounded-lg" 
              variant="shimmer"
            />
          </div>
          <div className="flex-1 space-y-3">
            <EnhancedSkeleton className="h-6 w-3/4" variant="shimmer" />
            <EnhancedSkeleton lines={2} className="h-4" variant="shimmer" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <EnhancedSkeleton className="h-8 w-20" variant="shimmer" />
                <EnhancedSkeleton className="h-5 w-24" variant="shimmer" />
              </div>
              {showButton && (
                <EnhancedSkeleton className="h-10 w-24 rounded-lg" variant="shimmer" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses} style={containerStyle} {...props}>
      {/* Image skeleton */}
      <div className="relative">
        <EnhancedSkeleton 
          className="w-full h-52 rounded-t-3xl" 
          variant="shimmer"
        />
        {/* Floating elements simulation */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <EnhancedSkeleton 
          className="h-6 w-4/5" 
          variant="shimmer"
        />
        
        {/* Description */}
        <EnhancedSkeleton 
          lines={2} 
          className="h-4" 
          variant="shimmer"
        />
        
        {/* Price and rating */}
        <div className="flex justify-between items-center">
          <EnhancedSkeleton className="h-8 w-20" variant="shimmer" />
          <EnhancedSkeleton className="h-5 w-16" variant="shimmer" />
        </div>

        {/* Sales badge and status */}
        <div className="flex items-center justify-between">
          <EnhancedSkeleton className="h-6 w-20 rounded-full" variant="shimmer" />
          <EnhancedSkeleton className="h-4 w-16" variant="shimmer" />
        </div>
        
        {/* Button */}
        {showButton && (
          <EnhancedSkeleton 
            className="h-12 w-full rounded-xl" 
            variant="shimmer"
          />
        )}
      </div>
    </div>
  );
}

export { ProductCardSkeleton };
