import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cart, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery<(Cart & { product: Product })[]>({
    queryKey: ["/api/cart"],
    enabled: !!user && isOpen,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("DELETE", `/api/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Product has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove product from cart.",
        variant: "destructive",
      });
    },
  });

  const stripeCheckoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/create-checkout-session");
    },
    onSuccess: async (data: { sessionId: string; url: string; orderId: string }) => {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        toast({
          title: "Payment Error",
          description: error.message || "There was an error redirecting to payment.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Checkout failed",
        description: error.message || "There was an error creating the checkout session.",
        variant: "destructive",
      });
    },
  });

  // Legacy checkout mutation (for testing or backup)
  const legacyCheckoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/orders");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: "Your digital products are now available for download.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order.",
        variant: "destructive",
      });
    },
  });

  const total = cartItems?.reduce((sum, item) => sum + parseFloat(item.product.price), 0) || 0;

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCartMutation.mutate(productId);
  };

  const handleStripeCheckout = () => {
    stripeCheckoutMutation.mutate();
  };

  const handleLegacyCheckout = () => {
    legacyCheckoutMutation.mutate();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shopping Cart
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Start shopping to add products to your cart
                </p>
                <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.product.images?.[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60"}
                          alt={item.product.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {item.product.title}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            Digital Product
                          </p>
                          <p className="text-primary font-semibold">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId || item.product._id)}
                          disabled={removeFromCartMutation.isPending}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <Button
                    onClick={handleStripeCheckout}
                    disabled={stripeCheckoutMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 mb-2"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {stripeCheckoutMutation.isPending ? "Processing..." : "Pay with Stripe"}
                  </Button>
                  <Button
                    onClick={handleLegacyCheckout}
                    disabled={legacyCheckoutMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {legacyCheckoutMutation.isPending ? "Processing..." : "Legacy Checkout"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
