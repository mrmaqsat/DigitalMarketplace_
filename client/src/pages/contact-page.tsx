import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Связаться с нами</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Связаться с нами</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Есть вопросы или нужна помощь? Мы здесь, чтобы помочь! Свяжитесь с нами, используя 
                  контактную информацию ниже или отправьте нам сообщение.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Контактная информация</h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Общая поддержка</h3>
                    <p>Email: support@digitalmart.com</p>
                    <p>Phone: +1 (234) 567-8901</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Деловые вопросы</h3>
                    <p>Email: business@digitalmart.com</p>
                    <p>Phone: +1 (234) 567-8902</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Время работы</h2>
              <div className="space-y-4 text-gray-700">
                <p>Понедельник - Пятница: 9:00 - 18:00 (МСК)</p>
                <p>Суббота: 10:00 - 16:00 (МСК)</p>
                <p>Воскресенье: Выходной</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Время ответа</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы стремимся отвечать на все запросы в течение 24 часов в рабочие дни. 
                  По срочным вопросам обращайтесь на линию поддержки напрямую.
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
