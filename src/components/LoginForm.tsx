import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

const LoginForm: React.FC = () => {
  const [fio, setFio] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(fio, password);
      if (!success) {
        setError("Неверное ФИО или пароль");
      }
    } catch (err) {
      setError("Ошибка при входе в систему");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Icon name="UserCheck" className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription>Система управления дежурствами</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fio">ФИО</Label>
              <Input
                id="fio"
                type="text"
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <Icon name="AlertCircle" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Демо доступы:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Иванов Иван Иванович (Руководитель)</div>
              <div>• Иванова Анна Сергеевна (Сотрудник)</div>
              <div>• Петрова Елена Викторовна (Руководитель)</div>
              <div className="mt-2 font-medium">Пароль для всех: 123456</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
