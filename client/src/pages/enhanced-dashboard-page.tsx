import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Order, Product } from "@shared/schema";
import EnhancedHeader from "@/components/enhanced-header";
import Footer from "@/components/footer";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Download, Star, ShoppingBag, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function EnhancedDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("purchases");

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatPrice = (price) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <EnhancedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-1/4">
            <Card className="bg-gradient-to-br from-primary-50 to-accent-50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {user.fullName}
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    {user.email}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {user.role}
                  </Badge>
                </div>
                <nav className="space-y-2">
                  <Button
                    variant={
                      activeTab === "purchases" ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setActiveTab("purchases")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />Мои покупки
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />Настройки
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-primary-600 leading-tight">
                Моя панель
              </h1>
              <p className="text-body-lg text-muted-foreground">
                Управляйте своими покупками и настройками аккаунта
              </p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="purchases">Мои покупки</TabsTrigger>
              </TabsList>

              <TabsContent value="purchases">
                <Card>
                  <CardHeader>
                    <CardTitle>История покупок</CardTitle>
                    <CardDescription>
                      Просматривайте и скачивайте свои купленные цифровые
                      товары
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="border rounded-lg p-6 bg-white shadow-sm animate-pulse"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-2">
                                <Skeleton className="h-5 w-48 rounded bg-neutral-200" />
                                <Skeleton className="h-4 w-32 rounded bg-neutral-200" />
                                <Skeleton className="h-3 w-24 rounded bg-neutral-200" />
                              </div>
                              <div className="text-right space-y-2">
                                <Skeleton className="h-5 w-16 rounded bg-neutral-200" />
                                <Skeleton className="h-5 w-20 rounded bg-neutral-200" />
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <Skeleton className="h-9 w-24 rounded bg-neutral-300" />
                              <Skeleton className="h-9 w-20 rounded bg-neutral-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : !orders || orders.length === 0 ? (
                      <div className="text-center py-32">
                        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Пока нет покупок
                        </h3>
                        <p className="text-body text-muted-foreground mb-6">
                          Начните покупки, чтобы увидеть их здесь.
                        </p>
                        <Button
                          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md"
                          onClick={() => navigate("/browse")}
                        >
                          Просмотреть товары
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-150"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-primary-600 mb-1">
                                  Заказ #{order.id}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  <span className="inline-flex items-center">
                                    <span className="mr-1">
                                      {formatDate(order.createdAt)}
                                    </span>
                                  </span>
                                  <span className="block mt-1 text-xs">
                                    {order.items.length} товар(ов)
                                  </span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary-600">
                                  {formatPrice(order.total)}
                                </p>
                                <Badge
                                  variant={
                                    order.status === "completed"
                                      ? "success"
                                      : "warning"
                                  }
                                  className="mt-1"
                                >
                                  {order.status === "completed"
                                    ? "Завершён"
                                    : order.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 rounded p-3"
                                >
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={
                                        item.product?.images?.[0] ||
                                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=40"
                                      }
                                      alt={item.product?.title || "Product"}
                                      className="w-12 h-8 object-cover rounded-lg"
                                    />
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {item.product?.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {formatPrice(item.price)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Star className="w-4 h-4 mr-1" />Отзыв
                                    </Button>
                                    <Button
                                      className="bg-primary-500 hover:bg-primary-600 text-white"
                                      size="sm"
                                    >
                                      <Download className="w-4 h-4 mr-1" />Скачать
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

