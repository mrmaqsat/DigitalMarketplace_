import { useQuery } from "@tanstack/react-query";
import { Order, Product } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Star, ShoppingBag, Calendar, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery<(Order & { items: any[] })[]>({
    queryKey: ["/api/orders"],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="" alt={user.fullName} />
                    <AvatarFallback className="text-xl">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user.role}
                  </Badge>
                </div>
                
                <nav className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Purchases
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">My Dashboard</h1>
              <p className="text-gray-600">Manage your purchases and account settings</p>
            </div>

            <Tabs defaultValue="purchases" className="space-y-6">
              <TabsList>
                <TabsTrigger value="purchases">My Purchases</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="purchases" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>
                      View and download your purchased digital products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="border rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <div className="text-right space-y-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <Skeleton className="h-9 w-24" />
                              <Skeleton className="h-9 w-20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : !orders || orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No purchases yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Start shopping to see your purchases here
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">
                          Browse Products
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">
                                  Order #{order.id}
                                </h3>
                                <p className="text-gray-600 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(order.createdAt)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {order.items.length} item(s)
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary text-lg">
                                  {formatPrice(order.total)}
                                </p>
                                <Badge 
                                  variant={order.status === "completed" ? "default" : "secondary"}
                                  className="mt-1"
                                >
                                  {order.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-3">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=40"}
                                      alt={item.product?.title || "Product"}
                                      className="w-12 h-8 object-cover rounded"
                                    />
                                    <div>
                                      <h4 className="font-medium">{item.product?.title}</h4>
                                      <p className="text-sm text-gray-600">
                                        {formatPrice(item.price)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Star className="w-4 h-4 mr-1" />
                                      Review
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

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-gray-900">{user.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <p className="mt-1 text-gray-900">{user.username}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <Button className="bg-primary hover:bg-primary/90">
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
