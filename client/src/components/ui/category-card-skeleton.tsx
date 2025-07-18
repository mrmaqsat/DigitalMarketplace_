import { cn } from "@/lib/utils";
import { EnhancedSkeleton } from "./enhanced-skeleton";

interface CategoryCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animationDelay?: number;
}

function CategoryCardSkeleton({ 
  className,
  animationDelay = 0,
  ...props 
}: CategoryCardSkeletonProps) {
  const containerStyle = {
    animationDelay: `${animationDelay}s`
  };

  return (
    <div 
      className={cn(
        "category-card modern-gradient rounded-3xl relative overflow-hidden min-h-[280px] border border-white/30 animate-scale-in",
        className
      )}
      style={containerStyle}
      {...props}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200/80 via-gray-300/60 to-gray-200/80 animate-shimmer" />
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm" />
      
      {/* Content skeleton */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
        {/* Icon skeleton */}
        <div className="w-16 h-16 mb-6 relative">
          <EnhancedSkeleton 
            className="w-full h-full rounded-full bg-white/30" 
            variant="shimmer"
          />
          {/* Animated pulse effect */}
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
        </div>
        
        {/* Title skeleton */}
        <EnhancedSkeleton 
          className="h-6 w-32 mb-3 bg-white/40 rounded-lg" 
          variant="shimmer"
        />
        
        {/* Subtitle skeleton */}
        <EnhancedSkeleton 
          className="h-4 w-24 bg-white/30 rounded-lg" 
          variant="shimmer"
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping" />
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/50 rounded-full animate-spin" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-shimmer skew-x-12" />
    </div>
  );
}

export { CategoryCardSkeleton };
