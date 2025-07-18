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
import { Search, ShoppingCart, Menu, User, Settings, LogOut, Store, Shield } from "lucide-react";
import CartSidebar from "./cart-sidebar";
import { Cart } from "@shared/schema";

export default function Header() {
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
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="logo-text hover:text-primary cursor-pointer hover:scale-105 transition-all duration-300">
                  Цифровой Маркет
                </h1>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                    <Input
                      type="text"
                      placeholder="Поиск цифровых товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2"
                    />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </form>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="nav-link">
                Каталог
              </Link>
              
              {user ? (
                <>
                  <Link href="/seller" className="nav-link">
                    Продавать
                  </Link>
                  
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
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.fullName} />
                          <AvatarFallback>
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <User className="mr-2 h-4 w-4" />
                        Панель управления
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/seller")}>
                        <Store className="mr-2 h-4 w-4" />
                        Панель продавца
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Панель админа
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleSettings}>
                        <Settings className="mr-2 h-4 w-4" />
                        Настройки
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button asChild>
                  <Link href="/auth">Войти</Link>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              {user && (
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
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </form>
              </div>
              
              <Link href="/browse" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                Каталог
              </Link>
              {user ? (
                <>
                  <Link href="/seller" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                    Продавать
                  </Link>
                  <Link href="/dashboard" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                    Панель управления
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                      Панель админа
                    </Link>
                  )}
                  <Link href="/settings" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                    Настройки
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link href="/auth" className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
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
