import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">О нас</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Наша миссия</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  DigitalMart — это ведущая торговая площадка, посвященная связыванию цифровых создателей с 
                  покупателями по всему миру. Наша миссия — дать создателям возможность монетизировать свои цифровые 
                  активы, предоставляя покупателям доступ к высококачественным цифровым продуктам.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Что мы делаем</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Мы предоставляем безопасную и удобную платформу для покупки и продажи цифровых продуктов, 
                  включая шаблоны, графику, программное обеспечение, электронные книги и многое другое. Наша платформа 
                  поддерживает создателей на каждом этапе их пути.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Наши ценности</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Инновации в цифровой торговле</li>
                  <li>Поддержка творческих профессионалов</li>
                  <li>Прозрачность во всех сделках</li>
                  <li>Создание процветающего цифрового сообщества</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Присоединяйтесь к нашему сообществу</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Независимо от того, являетесь ли вы создателем, желающим продать свою работу, или покупателем, 
                  ищущим уникальные цифровые продукты, DigitalMart — это ваш путь к цифровой торговой площадке. 
                  Присоединяйтесь к тысячам довольных пользователей, которые доверяют нам свои потребности в цифровой торговле.
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
