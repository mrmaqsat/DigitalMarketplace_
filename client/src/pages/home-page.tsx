import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type IProduct, type ICategory } from "@shared/models";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";
import { CategoryCardSkeleton } from "@/components/ui/category-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Shield, Award, Users, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ParticleField from "@/components/ParticleField";
import { FadeIn, SlideUp, SlideIn, ScaleIn, BounceIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

export default function HomePage() {
  const { user } = useAuth();

  const { data: products, isLoading: productsLoading } = useQuery<IProduct[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<ICategory[]>({
    queryKey: ["/api/categories"],
  });

  const categoryIcons = {
    "Цифровое искусство": "fas fa-palette",
    "Программное обеспечение": "fas fa-code",
    "Электронные книги": "fas fa-book",
    "Шаблоны": "fas fa-file-pdf",
    "Музыка": "fas fa-music",
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 sm:py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <FadeIn delay={0.2}>
              <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Новая платформа для цифрового творчества
              </Badge>
            </FadeIn>
            <SlideUp delay={0.4}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight ">
                Откройте для себя
                удивительные
                цифровые продукты
              </h1>
            </SlideUp>
            <SlideUp delay={0.6}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
                Найдите уникальные цифровые активы, шаблоны и творческие инструменты от талантливых создателей по всему миру
              </p>
            </SlideUp>

            <SlideUp delay={0.8}>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
                  <Link href="/browse">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Начать покупки
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm glass-effect font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Стать продавцом
                    </Button>
                  </Link>
                </div>
              )}
              {user && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
                  <Link href="/browse">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Просмотреть товары
                    </Button>
                  </Link>
                  <Link href="/seller">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm glass-effect font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Моя панель продавца
                    </Button>
                  </Link>
                </div>
              )}
            </SlideUp>

          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-white/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <FadeIn delay={0.2}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 text-gray-900 dark:text-gray-100 drop-shadow-sm">Почему выбирают нас?</h2>
            </FadeIn>
            <SlideUp delay={0.4}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Мы предлагаем лучший опыт покупки и продажи цифровых продуктов
              </p>
            </SlideUp>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all card-hover group-hover:border-primary/20 border border-transparent">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Безопасные платежи</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Все транзакции защищены современными методами шифрования и проходят через безопасные платежные системы
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all card-hover group-hover:border-primary/20 border border-transparent">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Поддержка 24/7</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Наша команда поддержки готова помочь вам в любое время дня и ночи с любыми вопросами или проблемами
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all card-hover group-hover:border-primary/20 border border-transparent">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Качество гарантировано</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Все продукты проходят строгую модерацию, обеспечивая высокое качество и соответствие описанию
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        {/* Canvas-based particle field - reduced on mobile */}
        <ParticleField
          particleCount={typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20}
          colors={['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#E5E7EB']}
          className="opacity-30 sm:opacity-50"
        />

        {/* Floating background particles - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-10 left-10 w-12 h-12 bg-primary/10 rounded-full blur-lg floating-animation" style={{ animationDelay: '0s' }}></div>
        <div className="hidden sm:block absolute top-32 right-16 w-8 h-8 bg-accent/15 rounded-full blur-md floating-animation" style={{ animationDelay: '1s' }}></div>
        <div className="hidden sm:block absolute bottom-40 left-20 w-16 h-16 bg-secondary/8 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="hidden sm:block absolute top-1/2 right-1/4 w-6 h-6 bg-primary/12 rounded-full blur-sm floating-animation" style={{ animationDelay: '3s' }}></div>
        <div className="hidden sm:block absolute bottom-16 right-10 w-10 h-10 bg-accent/10 rounded-full blur-lg floating-animation" style={{ animationDelay: '4s' }}></div>
        <div className="hidden sm:block absolute top-16 left-1/3 w-4 h-4 bg-secondary/20 rounded-full blur-sm floating-animation" style={{ animationDelay: '5s' }}></div>
        <div className="hidden sm:block absolute bottom-32 left-1/2 w-14 h-14 bg-primary/8 rounded-full blur-xl floating-animation" style={{ animationDelay: '6s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <FadeIn delay={0.2}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2 text-gray-900 dark:text-gray-100 drop-shadow-sm">Покупки по категориям</h2>
            </FadeIn>
            <SlideUp delay={0.4}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Исследуйте наш широкий ассортимент цифровых продуктов
              </p>
            </SlideUp>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {[...Array(5)].map((_, i) => (
                <CategoryCardSkeleton key={i} animationDelay={i * 0.1} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {categories?.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/browse?category=${category._id}`}
                  className="text-center group cursor-pointer animate-scale-in block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="category-card modern-gradient rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[220px] sm:min-h-[280px] border border-white/30 hover:border-white/50 glow-effect glass-card"
                    style={{
                      background: category.backgroundGradient || 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)',
                      backgroundImage: category.image ? `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%), url(${category.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500 rounded-2xl sm:rounded-3xl" />

                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all duration-300 rounded-2xl sm:rounded-3xl backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative z-10 text-white h-full flex flex-col justify-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 sm:group-hover:scale-125 group-hover:rotate-6 sm:group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl parallax-light">
                        <i className={categoryIcons[category.name as keyof typeof categoryIcons] || "fas fa-box"}></i>
                      </div>
                      <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white drop-shadow-lg group-hover:text-white/95 transition-all">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm flex items-center justify-center group-hover:text-white transition-all duration-300 drop-shadow-sm font-medium">
                        Просмотреть товары
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 sm:group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                      </p>
                    </div>

                    {/* Enhanced shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full skew-x-12 shimmer" />

                    {/* Floating particles effect */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full group-hover:animate-ping floating-particle" />
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-accent/30 rounded-full group-hover:animate-pulse floating-particle" />
                    <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-secondary/20 rounded-full group-hover:animate-bounce floating-particle" />
                    <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/50 rounded-full group-hover:animate-spin floating-particle" />
                    <div className="absolute top-1/3 left-1/5 w-4 h-4 bg-gray-200/40 rounded-full floating-particle" style={{ animationDelay: '3s' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-neutral to-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Рекомендуемые товары</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Лучшие продукты от наших создателей</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="hover:bg-primary hover:text-white transition-all font-semibold text-sm sm:text-base">
                Смотреть все
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} animationDelay={i * 0.1} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {products?.slice(0, 8).map((product, index) => (
                <div key={product._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </section>


      <Footer />
    </div>
  );
}
