import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Review, User } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  ShoppingCart, 
  Download, 
  Check, 
  Heart,
  Share2,
  Flag,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Комментарий должен содержать не менее 10 символов"),
});

type ReviewData = z.infer<typeof reviewSchema>;

export default function ProductPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Товар не найден");
      }
      return response.json();
    },
  });

  const { data: reviews } = useQuery<(Review & { user: User })[]>({
    queryKey: ["/api/products", id, "reviews"],
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cart", { productId: parseInt(id!) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Добавлено в корзину",
        description: `${product?.title} добавлен в вашу корзину.`,
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину.",
        variant: "destructive",
      });
    },
  });

  const buyNowMutation = useMutation({
    mutationFn: async () => {
      // Add to cart first, then checkout
      await apiRequest("POST", "/api/cart", { productId: parseInt(id!) });
      return await apiRequest("POST", "/api/orders");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Покупка успешна!",
        description: "Ваш товар теперь доступен для скачивания в личном кабинете.",
      });
      navigate("/dashboard");
    },
    onError: () => {
      toast({
        title: "Покупка не удалась",
        description: "Произошла ошибка при обработке вашей покупки.",
        variant: "destructive",
      });
    },
  });

  const reviewForm = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewData) => {
      return await apiRequest("POST", `/api/products/${id}/reviews`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      setShowReviewForm(false);
      reviewForm.reset();
      toast({
        title: "Отзыв отправлен",
        description: "Спасибо за ваш отзыв!",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв.",
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

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-500" : ""}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Необходим вход",
        description: "Пожалуйста, войдите в систему, чтобы добавить товары в корзину.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    addToCartMutation.mutate();
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Необходим вход",
        description: "Пожалуйста, войдите в систему, чтобы приобрести товары.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    buyNowMutation.mutate();
  };

  const onSubmitReview = (data: ReviewData) => {
    submitReviewMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h1>
              <p className="text-gray-600 mb-6">Товар, который вы ищете, не существует.</p>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                На главную
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 bg-white rounded-lg overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
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
              <h1 className="text-3xl font-bold text-secondary mb-4">{product.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {renderStars(parseFloat(product.rating || "0"))}
                <span className="text-gray-600">
                  {product.rating} ({product.reviewCount} отзывов)
                </span>
                <Badge variant="secondary">
                  {product.salesCount} продаж
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Описание</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Что включено:</h3>
              <div className="space-y-2">
                {product.files?.map((file, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <FileText className="w-4 h-4 mr-2" />
                    Цифровой файл {index + 1}
                  </div>
                ))}
                <div className="flex items-center text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Изображения для предпросмотра в высоком разрешении
                </div>
                <div className="flex items-center text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Документация и поддержка
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {addToCartMutation.isPending ? (
                  "Добавление в корзину..."
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Добавить в корзину - {formatPrice(product.price)}
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={buyNowMutation.isPending}
                variant="secondary"
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
                size="lg"
              >
                {buyNowMutation.isPending ? (
                  "Обработка..."
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Купить сейчас
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Отзывы покупателей</h2>
                {user && (
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    variant="outline"
                  >
                    Написать отзыв
                  </Button>
                )}
              </div>

              {showReviewForm && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4">
                      <div>
                        <Label>Рейтинг</Label>
                        <div className="mt-2">
                          {renderStars(
                            reviewForm.watch("rating"),
                            true,
                            (rating) => reviewForm.setValue("rating", rating)
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="comment">Комментарий</Label>
                        <Textarea
                          id="comment"
                          {...reviewForm.register("comment")}
                          placeholder="Поделитесь своими мыслями об этом товаре..."
                          className="mt-2"
                        />
                        {reviewForm.formState.errors.comment && (
                          <p className="text-sm text-destructive mt-1">
                            {reviewForm.formState.errors.comment.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          type="submit"
                          disabled={submitReviewMutation.isPending}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {submitReviewMutation.isPending ? "Отправка..." : "Отправить отзыв"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-6">
                {!reviews || reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Отзывов пока нет
                    </h3>
                    <p className="text-gray-500">
                      Будьте первым, кто оставит отзыв об этом товаре!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src="" alt={review.user.fullName} />
                          <AvatarFallback>
                            {review.user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.user.fullName}</h4>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
