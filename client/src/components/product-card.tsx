import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cart", { productId: product._id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add products to your cart.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const primaryImage = product.images?.[0] || "/api/placeholder/400/250";

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer card-hover-2d border border-gray-100 hover:border-primary/30 overflow-hidden glow-effect relative">
      <Link href={`/product/${product._id}`}>
        <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-40 sm:h-48 md:h-52 object-cover transition-all duration-500 group-hover:scale-110 image-hover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/30 transition-all duration-500" />
          
          {/* Shimmer effect on hover - reduced on mobile */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full skew-x-12" />
          
          {product.status === "pending" && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm glass-effect">
                Pending Approval
              </Badge>
            </div>
          )}
          
          {/* Floating elements - hidden on mobile for performance */}
          <div className="hidden sm:block absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full group-hover:animate-ping" />
          <div className="hidden sm:block absolute bottom-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:animate-pulse" />
        </div>
      </Link>
      
      <div className="p-4 sm:p-6">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center text-yellow-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            <span className="ml-1 text-muted-foreground text-xs sm:text-sm font-medium">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <TrendingUp className="w-3 h-3 mr-1" />
            {product.salesCount} sales
          </Badge>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className="w-3 h-3 mr-1" />
            Best Seller
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || !user}
          className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-2.5 sm:py-3 rounded-xl text-sm sm:text-base"
        >
          {addToCartMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
