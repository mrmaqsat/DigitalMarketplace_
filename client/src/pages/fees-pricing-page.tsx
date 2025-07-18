import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FeesPricingPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Комиссии и цены</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Обзор</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Узнайте о наших конкурентных комиссиях и ценовой структуре, которая поддерживает как 
                  продавцов, так и покупателей. Мы стремимся предложить прозрачные и справедливые цены для всех наших пользователей.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Комиссии продавца</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  За каждую совершенную продажу взимается небольшая комиссия для поддержания нашей платформы. 
                  Размер комиссии варьируется в зависимости от типа продукта и уровня подписки продавца.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Планы подписки</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Выберите из различных планов подписки, адаптированных под ваши потребности. Наши гибкие планы 
                  предлагают разные уровни поддержки и функций для улучшения вашего опыта продаж.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Обработка платежей</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Все транзакции безопасны и обрабатываются через надежных партнеров. Мы принимаем основные 
                  кредитные карты, PayPal и другие популярные способы оплаты.
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
