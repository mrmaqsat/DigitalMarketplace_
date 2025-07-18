import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Политика конфиденциальности</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Сбор информации</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы собираем информацию, которую вы предоставляете нам напрямую, например, при создании учетной записи, 
                  совершении покупки или обращении к нам за поддержкой.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Использование информации</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы используем собранную информацию для предоставления, поддержания и улучшения наших услуг, 
                  обработки транзакций и общения с вами.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Защита данных</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы применяем соответствующие технические и организационные меры для защиты вашей 
                  персональной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Сторонние сервисы</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы можем использовать сторонние сервисы для помощи в работе нашей платформы. Эти сервисы 
                  могут иметь доступ к вашей информации только для выполнения конкретных задач от нашего имени.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Контактная информация</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Если у вас есть вопросы о данной политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу 
                  privacy@digitalmart.com.
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
