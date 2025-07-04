import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDutyData } from "@/hooks/useDutyData";
import LoginForm from "@/components/LoginForm";
import MonthlySchedule from "@/components/MonthlySchedule";
import PrintSchedule from "@/components/PrintSchedule";
import Icon from "@/components/ui/icon";

const Index = () => {
  const { user, logout, isAuthenticated, otdels } = useAuth();
  const {
    duties,
    users,
    loading,
    getDutiesByOtdel,
    getUsersByOtdel,
    takeDuty,
    cancelDuty,
    approveDuty,
  } = useDutyData();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(
    user?.otdel || 1,
  );
  const [showTakeDutyDialog, setShowTakeDutyDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Получение данных для текущего отделения
  const currentOtdel = otdels.find((o) => o.id_o === selectedDepartment);
  const departmentUsers = getUsersByOtdel(selectedDepartment);
  const weekDuties = getDutiesByOtdel(selectedDepartment, currentWeek);
  const onDutyToday = weekDuties.filter((duty) => {
    const today = new Date().toISOString().split("T")[0];
    return duty.data === today;
  });

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + currentWeek * 7);
    return date;
  });

  const handleTakeDuty = async () => {
    if (!user || !selectedDate) return;

    setActionLoading(true);
    try {
      await takeDuty(selectedDepartment, selectedDate, user.id_u);
      setShowTakeDutyDialog(false);
      setSelectedDate("");
    } catch (error) {
      console.error("Ошибка при взятии дежурства:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDuty = async (dutyId: number) => {
    setActionLoading(true);
    try {
      await cancelDuty(dutyId);
    } catch (error) {
      console.error("Ошибка при отмене дежурства:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveDuty = async (dutyId: number) => {
    setActionLoading(true);
    try {
      await approveDuty(dutyId);
    } catch (error) {
      console.error("Ошибка при утверждении дежурства:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Icon name="Calendar" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Система дежурств
                </h1>
                <p className="text-sm text-slate-600">{currentOtdel?.name_o}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {user?.fio
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user?.fio}</p>
                  <p className="text-xs text-slate-600">{user?.specialnost}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <Icon name="LogOut" className="h-4 w-4 mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Building" className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium">Отделение:</span>
              </div>
              <Select
                value={selectedDepartment.toString()}
                onValueChange={(value) => setSelectedDepartment(Number(value))}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {otdels.map((otdel) => (
                    <SelectItem key={otdel.id_o} value={otdel.id_o.toString()}>
                      {otdel.name_o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog
              open={showTakeDutyDialog}
              onOpenChange={setShowTakeDutyDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" className="h-4 w-4 mr-2" />
                  Взять дежурство
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Взять дежурство</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Дата дежурства:
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleTakeDuty}
                      disabled={!selectedDate || actionLoading}
                    >
                      {actionLoading ? "Сохранение..." : "Взять дежурство"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowTakeDutyDialog(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="monthly">Месячный график</TabsTrigger>
            <TabsTrigger value="planning">Планирование</TabsTrigger>
            <TabsTrigger value="staff">Сотрудники</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Сейчас дежурят
                  </CardTitle>
                  <Icon name="Users" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {onDutyToday.length}
                  </div>
                  <p className="text-xs text-slate-600">сотрудников</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Сотрудников
                  </CardTitle>
                  <Icon name="Building" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {departmentUsers.length}
                  </div>
                  <p className="text-xs text-slate-600">в отделении</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Дежурств
                  </CardTitle>
                  <Icon name="Clock" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {weekDuties.length}
                  </div>
                  <p className="text-xs text-slate-600">на неделю</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ожидают</CardTitle>
                  <Icon name="AlertCircle" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {weekDuties.filter((d) => !d.approved).length}
                  </div>
                  <p className="text-xs text-slate-600">утверждения</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Duties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Clock" className="h-5 w-5 mr-2 text-blue-600" />
                  Текущие дежурства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onDutyToday.map((duty) => {
                    const dutyUser = users.find((u) => u.id_u === duty.id_u);
                    if (!dutyUser) return null;

                    return (
                      <div
                        key={duty.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-600 text-white">
                              {dutyUser.fio
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">
                              {dutyUser.fio}
                            </p>
                            <p className="text-sm text-slate-600">
                              {dutyUser.specialnost}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={duty.approved ? "secondary" : "outline"}
                            className={
                              duty.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {duty.approved
                              ? "Утверждено"
                              : "Ожидает утверждения"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Icon name="Phone" className="h-4 w-4 mr-2" />
                            {dutyUser.telefon}
                          </Button>
                          {user?.isRukovod && !duty.approved && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveDuty(duty.id)}
                              disabled={actionLoading}
                            >
                              <Icon name="Check" className="h-4 w-4 mr-2" />
                              Утвердить
                            </Button>
                          )}
                          {(user?.id_u === duty.id_u || user?.isRukovod) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelDuty(duty.id)}
                              disabled={actionLoading}
                            >
                              <Icon name="X" className="h-4 w-4 mr-2" />
                              Отменить
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {onDutyToday.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Icon
                        name="Calendar"
                        className="h-12 w-12 mx-auto mb-4 text-slate-300"
                      />
                      <p>Нет дежурств на сегодня</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Icon
                      name="Calendar"
                      className="h-5 w-5 mr-2 text-blue-600"
                    />
                    Расписание дежурств
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek - 1)}
                    >
                      <Icon name="ChevronLeft" className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-3">
                      Неделя{" "}
                      {currentWeek === 0
                        ? "текущая"
                        : currentWeek > 0
                          ? `+${currentWeek}`
                          : currentWeek}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                    >
                      <Icon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, index) => {
                    const dateString = date.toISOString().split("T")[0];
                    const dayDuties = weekDuties.filter(
                      (duty) => duty.data === dateString,
                    );

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-3 min-h-32"
                      >
                        <div className="text-sm font-medium text-slate-900 mb-2">
                          {date.toLocaleDateString("ru-RU", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-xs text-slate-600 mb-3">
                          {date.toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="space-y-1">
                          {dayDuties.map((duty) => {
                            const dutyUser = users.find(
                              (u) => u.id_u === duty.id_u,
                            );
                            return (
                              <div
                                key={duty.id}
                                className={`text-xs p-2 rounded border-l-2 ${
                                  duty.approved
                                    ? "bg-green-50 border-green-600"
                                    : "bg-yellow-50 border-yellow-600"
                                }`}
                              >
                                <div className="font-medium">
                                  {dutyUser?.fio}
                                </div>
                                <div className="text-slate-600">
                                  {dutyUser?.specialnost}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Schedule */}
          <TabsContent value="monthly" className="space-y-6">
            <MonthlySchedule selectedDepartment={selectedDepartment} />
            <PrintSchedule
              selectedDepartment={selectedDepartment}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          </TabsContent>

          {/* Staff */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Users" className="h-5 w-5 mr-2 text-blue-600" />
                  Сотрудники
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentUsers.map((person) => {
                    const hasActiveDuty = weekDuties.some(
                      (duty) =>
                        duty.id_u === person.id_u &&
                        duty.data === new Date().toISOString().split("T")[0],
                    );

                    return (
                      <div
                        key={person.id_u}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-slate-600 text-white">
                              {person.fio
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">
                              {person.fio}
                            </p>
                            <p className="text-sm text-slate-600">
                              {person.specialnost}
                            </p>
                            {person.isRukovod && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Руководитель
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Icon name="Phone" className="h-4 w-4 mr-2" />
                          {person.telefon}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Icon name="Building" className="h-4 w-4 mr-2" />
                          {currentOtdel?.name_o}
                        </div>
                        <div className="flex items-center justify-between">
                          {hasActiveDuty ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              На дежурстве
                            </Badge>
                          ) : (
                            <Badge variant="outline">Свободен</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Icon name="Calendar" className="h-4 w-4 mr-2" />
                            График
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning */}
          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon
                    name="Calendar"
                    className="h-5 w-5 mr-2 text-blue-600"
                  />
                  Планирование дежурств
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.isRukovod ? (
                  <div className="space-y-4">
                    <Alert>
                      <Icon name="Info" className="h-4 w-4" />
                      <AlertDescription>
                        Раздел планирования дежурств на месяц будет добавлен в
                        следующей итерации. Сейчас вы можете утверждать
                        дежурства, взятые сотрудниками.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <h4 className="font-medium">
                        Дежурства, ожидающие утверждения:
                      </h4>
                      {weekDuties
                        .filter((duty) => !duty.approved)
                        .map((duty) => {
                          const dutyUser = users.find(
                            (u) => u.id_u === duty.id_u,
                          );
                          return (
                            <div
                              key={duty.id}
                              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border"
                            >
                              <div>
                                <p className="font-medium">{dutyUser?.fio}</p>
                                <p className="text-sm text-slate-600">
                                  {new Date(duty.data).toLocaleDateString(
                                    "ru-RU",
                                  )}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveDuty(duty.id)}
                                  disabled={actionLoading}
                                >
                                  <Icon name="Check" className="h-4 w-4 mr-2" />
                                  Утвердить
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelDuty(duty.id)}
                                  disabled={actionLoading}
                                >
                                  <Icon name="X" className="h-4 w-4 mr-2" />
                                  Отклонить
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      {weekDuties.filter((duty) => !duty.approved).length ===
                        0 && (
                        <p className="text-slate-500 text-center py-4">
                          Нет дежурств, ожидающих утверждения
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <Icon name="Lock" className="h-4 w-4" />
                    <AlertDescription>
                      Доступ к планированию дежурств есть только у руководителей
                      отделений.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
