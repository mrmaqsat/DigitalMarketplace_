import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Поддержка</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Связаться с нами</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Нужна помощь? Наша служба поддержки готова помочь вам. 
                  Обращайтесь к нам следующими способами:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email: support@digitalmart.com</li>
                  <li>Телефон: +1 (234) 567-8901</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Часто задаваемые вопросы</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Ознакомьтесь с нашими часто задаваемыми вопросами, чтобы найти ответы на распространенные вопросы. 
                  От настройки аккаунта до вопросов об оплате — мы охватываем всё.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary mb-4">Форум сообщества</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Присоединяйтесь к нашему форуму сообщества, чтобы общаться с другими пользователями, обмениваться опытом 
                  и узнавать новые советы и трюки.
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
