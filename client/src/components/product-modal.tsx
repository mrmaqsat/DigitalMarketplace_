import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Star, ShoppingCart, Download, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId && isOpen,
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cart", { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product?.title} has been added to your cart.`,
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

  const buyNowMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", { productId });
      return await apiRequest("POST", "/api/orders");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Purchase successful!",
        description: "Your product is now available for download in your dashboard.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
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

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase products.",
        variant: "destructive",
      });
      return;
    }
    buyNowMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-64" /> : product?.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-80 w-full rounded-lg" />
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded" />
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : product ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.images?.[selectedImageIndex] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
                      alt={product.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className={`w-full h-16 object-cover rounded cursor-pointer border-2 ${
                            selectedImageIndex === index ? "border-primary" : "border-transparent"
                          } hover:border-primary/50 transition-colors`}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      {renderStars(parseFloat(product.rating || "0"))}
                      <span className="text-gray-600 text-sm">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                      <Badge variant="secondary">
                        {product.salesCount} sales
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">What's Included:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {product.files?.map((_, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Digital file {index + 1}
                        </li>
                      ))}
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        High-resolution images
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        Documentation and support
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {addToCartMutation.isPending ? (
                        "Adding..."
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart - {formatPrice(product.price)}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleBuyNow}
                      disabled={buyNowMutation.isPending}
                      variant="secondary"
                      className="w-full bg-secondary hover:bg-secondary/90 text-white"
                    >
                      {buyNowMutation.isPending ? (
                        "Processing..."
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product not found
                </h3>
                <p className="text-gray-500">
                  The product you're looking for doesn't exist.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
