import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Политика возврата</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Обзор</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Наша политика возврата разработана для защиты как покупателей, так и продавцов на DigitalMart. Если вы 
                  не удовлетворены своей покупкой, пожалуйста, ознакомьтесь с правилами ниже, чтобы определить 
                  возможность возврата.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Право на возврат</h2>
              <div className="space-y-4 text-gray-700">
                <p>Сценарии, которые предполагают возврат:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Продукт неисправен или не соответствует описанию</li>
                  <li>Продукт не был доставлен</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Запрос на возврат</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Чтобы запросить возврат, пожалуйста, свяжитесь с нашей службой поддержки в течение 14 дней с момента покупки. Предоставьте 
                  детали и доказательства вашей проблемы для плавного разрешения.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Процесс возврата</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  После одобрения запроса на возврат процесс будет начат, и средства будут 
                  возвращены на ваш исходный способ оплаты в течение 7-10 рабочих дней.
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
