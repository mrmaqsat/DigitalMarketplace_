import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Условия использования</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Принятие условий</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Получая доступ и используя DigitalMart, вы принимаете и соглашаетесь соблюдать 
                  условия и положения данного соглашения. Если вы не согласны с вышеизложенным, 
                  пожалуйста, не используйте данный сервис.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Лицензия на использование</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Разрешается временно загрузить одну копию материалов с сайта DigitalMart 
                  только для личного, некоммерческого временного просмотра.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Обязательства пользователей</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Пользователи несут ответственность за сохранение конфиденциальности информации 
                  своей учетной записи и за все действия, происходящие под их учетной записью.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Ограничения</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Ни при каких обстоятельствах DigitalMart или его поставщики не несут ответственности 
                  за любые убытки, возникающие в результате использования или невозможности использования 
                  материалов на сайте DigitalMart.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Применимое право</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Данные условия и положения регулируются и толкуются в соответствии с законами 
                  юрисдикции, в которой работает DigitalMart.
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
