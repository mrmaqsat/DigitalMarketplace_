import Header from "@/components/header";
import Footer from "@/components/footer";

export default function HowToBuyPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Как купить</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Начало работы</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Добро пожаловать в Цифровой Маркет! Покупка цифровых товаров на нашей платформе проста и безопасна. 
                  Следуйте этим шагам, чтобы совершить первую покупку:
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Пошаговое руководство</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Просмотр товаров</h3>
                    <p className="text-gray-700">
                      Используйте наши возможности поиска и фильтрации, чтобы найти цифровые товары, которые соответствуют вашим потребностям. 
                      Вы можете просматривать по категориям, ценовому диапазону или популярности.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Создание аккаунта</h3>
                    <p className="text-gray-700">
                      Зарегистрируйте бесплатную учётную запись для доступа ко всему нашему маркетплейсу. 
                      Это позволит вам сохранять избранное, отслеживать покупки и оставлять отзывы.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Добавление в корзину</h3>
                    <p className="text-gray-700">
                      Нажмите "Добавить в корзину" на любом товаре, который вы хотите купить. 
                      Вы можете добавить несколько товаров перед оформлением заказа.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Безопасная оплата</h3>
                    <p className="text-gray-700">
                      Просмотрите свой заказ и перейдите к оформлению. Мы принимаем все основные кредитные карты 
                      и PayPal для безопасной обработки платежей.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Мгновенная загрузка</h3>
                    <p className="text-gray-700">
                      После успешной оплаты вы получите немедленный доступ для скачивания своих 
                      цифровых товаров. Ссылки также отправляются на вашу электронную почту для будущего использования.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Методы оплаты</h2>
              <div className="space-y-4 text-gray-700">
                <p>Мы принимаем следующие способы оплаты:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Кредитные карты (Visa, MasterCard, American Express)</li>
                  <li>PayPal</li>
                  <li>Apple Pay</li>
                  <li>Google Pay</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Нужна помощь?</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Если у вас возникли проблемы в процессе покупки, наша служба поддержки 
                  готова помочь. Свяжитесь с нами через страницу поддержки или напишите нам напрямую.
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
