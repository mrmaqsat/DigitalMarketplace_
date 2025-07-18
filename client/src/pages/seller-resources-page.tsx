import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SellerResourcesPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Ресурсы для продавцов</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Инструменты и ресурсы</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Доступ к обширной коллекции инструментов и ресурсов, которые помогут вам добиться успеха как продавцу. 
                  От рыночных исследований до промоматериалов, у нас есть все, что вам нужно.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Советы по маркетингу</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Узнайте эффективные маркетинговые стратегии, чтобы увеличить видимость ваших продуктов и продажи. 
                  Узнайте, как оптимизировать ваши списки и достичь вашей целевой аудитории.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Лучшие практики</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Следуйте нашим лучшим практикам для успешных продаж на DigitalMart. Эти рекомендации помогут вам 
                  создавать привлекательные продуктовые записи и обеспечивать отличный уровень обслуживания клиентов.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Образовательный контент</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Получите доступ к обучающим материалам, вебинарам и образовательному контенту, чтобы улучшить свои навыки продаж. 
                  Оставайтесь в курсе последних тенденций и методов цифровой коммерции.
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
