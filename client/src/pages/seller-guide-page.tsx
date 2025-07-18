import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Руководство продавца</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Начало работы</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Добро пожаловать в DigitalMart! Стать продавцом легко, и это даёт вам платформу для 
                  демонстрации и продажи ваших цифровых товаров. Вот руководство для начала работы:
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Создание аккаунта продавца</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Зарегистрируйтесь как продавец и предоставьте данные о своём бизнесе. Это позволит вам 
                  получить доступ к инструментам продавца и начать размещать свои товары.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Размещение товаров</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Используйте наш интуитивный интерфейс для размещения цифровых товаров. Предоставляйте 
                  подробные описания, цены и загружайте соответствующие файлы или изображения.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Управление продажами</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Отслеживайте свои продажи через панель управления. Получайте доступ к аналитике продаж, 
                  отслеживайте статусы заказов и управляйте взаимодействием с клиентами без проблем.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
