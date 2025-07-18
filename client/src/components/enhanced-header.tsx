import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Menu, User, Settings, LogOut, Store, Shield, Bell } from "lucide-react";
import CartSidebar from "./cart-sidebar";
import { Cart } from "@shared/schema";

export default function EnhancedHeader() {
  const [, navigate] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();

  const { data: cartItems } = useQuery<(Cart & { product: any })[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const cartCount = cartItems?.length || 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg">Ц</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      Цифровой Маркет
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide leading-none">
                      Digital Marketplace
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Поиск цифровых товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/70 border-neutral-200 rounded-xl focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-body placeholder:text-muted-foreground"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors duration-200" />
                  </div>
                </div>
              </form>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/browse">
                <Button variant="ghost" className="text-body font-medium hover:bg-primary-50 hover:text-primary-700 transition-all duration-200">
                  Каталог
                </Button>
              </Link>
              
              {user ? (
                <>
                  <Link href="/seller">
                    <Button variant="ghost" className="text-body font-medium hover:bg-primary-50 hover:text-primary-700 transition-all duration-200">
                      Продавать
                    </Button>
                  </Link>
                  
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                  
                  {/* Cart */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 ring-2 ring-primary-100 ring-offset-2">
                          <AvatarImage src="" alt={user.fullName} />
                          <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg mb-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={user.fullName} />
                          <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold text-lg">
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="py-2">
                        <User className="mr-3 h-4 w-4" />
                        <span className="text-body">Панель управления</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/seller")} className="py-2">
                        <Store className="mr-3 h-4 w-4" />
                        <span className="text-body">Панель продавца</span>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="py-2">
                          <Shield className="mr-3 h-4 w-4" />
                          <span className="text-body">Панель админа</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleSettings} className="py-2">
                        <Settings className="mr-3 h-4 w-4" />
                        <span className="text-body">Настройки</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="py-2 text-red-600 focus:text-red-600">
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-body">Выйти</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  <Link href="/auth">Войти</Link>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              {user && (
                <>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border-neutral-200 rounded-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </form>
              </div>
              
              <Link href="/browse" className="block px-4 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg font-medium transition-all duration-200">
                Каталог
              </Link>
              
              {user ? (
                <>
                  <Link href="/seller" className="block px-4 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg font-medium transition-all duration-200">
                    Продавать
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg font-medium transition-all duration-200">
                    Панель управления
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg font-medium transition-all duration-200">
                      Панель админа
                    </Link>
                  )}
                  <Link href="/settings" className="block px-4 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg font-medium transition-all duration-200">
                    Настройки
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link href="/auth" className="block px-4 py-3 bg-primary-500 text-white text-center rounded-lg font-medium hover:bg-primary-600 transition-all duration-200">
                  Войти
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
