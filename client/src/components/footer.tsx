import { Link } from "wouter";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-accent text-white py-16 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gradient bg-gradient-to-r from-white to-white/80 bg-clip-text">Цифровой Маркет</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Маркетплейс для цифровых создателей и покупателей по всему миру.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/zhaksytech" className="text-white/70 hover:text-white transition-all hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/zhaksytex?igsh=cXdta3ZjcW0xb2Mz" className="text-white/70 hover:text-white transition-all hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/zhaksy-tech/" className="text-white/70 hover:text-white transition-all hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Для покупателей</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Просмотр товаров
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="hover:text-white transition-colors">
                  Как купить
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Поддержка
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Политика возврата
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Для продавцов</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/seller" className="hover:text-white transition-colors">
                  Начать продажи
                </Link>
              </li>
              <li>
                <Link href="/seller-guide" className="hover:text-white transition-colors">
                  Руководство продавца
                </Link>
              </li>
              <li>
                <Link href="/fees-pricing" className="hover:text-white transition-colors">
                  Комиссии и цены
                </Link>
              </li>
              <li>
                <Link href="/seller-resources" className="hover:text-white transition-colors">
                  Ресурсы продавца
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
          <p>&copy; 2025 Цифровой Маркет. Все права защищены.</p>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
    </footer>
  );
}
