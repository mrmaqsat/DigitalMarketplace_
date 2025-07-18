import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ShoppingBag, Star, Users } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Пароль обязателен"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа"),
  email: z.string().email("Неверный адрес электронной почты"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  fullName: z.string().min(1, "Полное имя обязательно"),
  role: z.string().default("user"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already authenticated
  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      role: "user",
    },
  });

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate("/"),
    });
  };

  const onRegister = (data: RegisterData) => {
    registerMutation.mutate(data, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral via-white to-neutral">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Forms */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Цифровой Маркет</h1>
              <p className="text-gray-600">Присоединяйтесь к нашему маркетплейсу цифровых создателей</p>
            </div>

            <Card className="w-full max-w-md mx-auto lg:mx-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Добро пожаловать</CardTitle>
                <CardDescription className="text-center">
                  Войдите в свою учетную запись или создайте новую
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Войти</TabsTrigger>
                    <TabsTrigger value="register">Регистрация</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          {...loginForm.register("username")}
                          placeholder="Введите ваше имя пользователя"
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          {...loginForm.register("password")}
                          placeholder="Введите ваш пароль"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">
                          Запомнить меня
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Вход..." : "Войти"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Полное имя</Label>
                        <Input
                          id="fullName"
                          {...registerForm.register("fullName")}
                          placeholder="Введите ваше полное имя"
                        />
                        {registerForm.formState.errors.fullName && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-username">Имя пользователя</Label>
                        <Input
                          id="reg-username"
                          {...registerForm.register("username")}
                          placeholder="Выберите имя пользователя"
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Электронная почта</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerForm.register("email")}
                          placeholder="Введите вашу электронную почту"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Пароль</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          {...registerForm.register("password")}
                          placeholder="Создайте пароль"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm">
                          Я согласен с{" "}
                          <a href="#" className="text-primary hover:underline">
                            Условиями использования
                          </a>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Создание аккаунта..." : "Создать аккаунт"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Hero */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-secondary mb-4">
                Присоединяйтесь к тысячам создателей
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Продавайте свои цифровые товары или открывайте удивительный контент от талантливых создателей по всему миру.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Легкая продажа</h3>
                <p className="text-sm text-gray-600">
                  Загружайте и продавайте свои цифровые товары всего за несколько кликов
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Мировое присутствие</h3>
                <p className="text-sm text-gray-600">
                  Связывайтесь с клиентами со всего мира
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Качественные товары</h3>
                <p className="text-sm text-gray-600">
                  Открывайте высококачественные цифровые активы и шаблоны
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Мгновенный доступ</h3>
                <p className="text-sm text-gray-600">
                  Получите немедленный доступ к вашим покупкам
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
