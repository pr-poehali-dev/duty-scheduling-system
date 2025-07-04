import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock data - в реальном проекте будет из SQL базы
  const departments = [
    { id: "therapy", name: "Терапия", head: "Иванов И.И." },
    { id: "surgery", name: "Хирургия", head: "Петров П.П." },
    { id: "cardiology", name: "Кардиология", head: "Сидоров С.С." },
    { id: "neurology", name: "Неврология", head: "Козлов К.К." },
  ];

  const staff = [
    {
      id: 1,
      fio: "Иванова Анна Сергеевна",
      department: "therapy",
      specialty: "Терапевт",
      phone: "+7 (999) 123-45-67",
      onDuty: true,
    },
    {
      id: 2,
      fio: "Петров Михаил Александрович",
      department: "surgery",
      specialty: "Хирург",
      phone: "+7 (999) 234-56-78",
      onDuty: false,
    },
    {
      id: 3,
      fio: "Сидорова Елена Викторовна",
      department: "cardiology",
      specialty: "Кардиолог",
      phone: "+7 (999) 345-67-89",
      onDuty: true,
    },
    {
      id: 4,
      fio: "Козлов Андрей Николаевич",
      department: "neurology",
      specialty: "Невролог",
      phone: "+7 (999) 456-78-90",
      onDuty: false,
    },
  ];

  const dutySchedule = [
    {
      date: "2025-01-06",
      staff: "Иванова А.С.",
      department: "therapy",
      time: "08:00-20:00",
    },
    {
      date: "2025-01-06",
      staff: "Сидорова Е.В.",
      department: "cardiology",
      time: "20:00-08:00",
    },
    {
      date: "2025-01-07",
      staff: "Петров М.А.",
      department: "surgery",
      time: "08:00-20:00",
    },
    {
      date: "2025-01-07",
      staff: "Козлов А.Н.",
      department: "neurology",
      time: "20:00-08:00",
    },
  ];

  const onDutyStaff = staff.filter((s) => s.onDuty);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + currentWeek * 7);
    return date;
  });

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
                <p className="text-sm text-slate-600">Медицинский центр</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Icon name="User" className="h-4 w-4 mr-2" />
                Профиль
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Settings" className="h-4 w-4 mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="planning">Планирование</TabsTrigger>
            <TabsTrigger value="reports">Отчеты</TabsTrigger>
            <TabsTrigger value="my-duties">Мои дежурства</TabsTrigger>
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
                    {onDutyStaff.length}
                  </div>
                  <p className="text-xs text-slate-600">сотрудников</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Отделений
                  </CardTitle>
                  <Icon name="Building" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {departments.length}
                  </div>
                  <p className="text-xs text-slate-600">активных</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Смен сегодня
                  </CardTitle>
                  <Icon name="Clock" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-xs text-slate-600">запланировано</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Экстренные
                  </CardTitle>
                  <Icon name="AlertCircle" className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <p className="text-xs text-slate-600">вызовов</p>
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
                  {onDutyStaff.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
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
                            {person.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          На дежурстве
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Icon name="Phone" className="h-4 w-4 mr-2" />
                          {person.phone}
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  {weekDates.map((date, index) => (
                    <div key={index} className="border rounded-lg p-3 min-h-32">
                      <div className="text-sm font-medium text-slate-900 mb-2">
                        {date.toLocaleDateString("ru-RU", { weekday: "short" })}
                      </div>
                      <div className="text-xs text-slate-600 mb-3">
                        {date.toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="space-y-1">
                        {dutySchedule
                          .filter(
                            (duty) =>
                              duty.date === date.toISOString().split("T")[0],
                          )
                          .map((duty, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-600"
                            >
                              <div className="font-medium">{duty.staff}</div>
                              <div className="text-slate-600">{duty.time}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  {staff.map((person) => (
                    <div
                      key={person.id}
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
                            {person.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Icon name="Phone" className="h-4 w-4 mr-2" />
                        {person.phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Icon name="Building" className="h-4 w-4 mr-2" />
                        {
                          departments.find((d) => d.id === person.department)
                            ?.name
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        {person.onDuty ? (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder tabs */}
          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle>Планирование дежурств</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Раздел планирования дежурств будет добавлен в следующих
                  итерациях.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Отчеты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Раздел отчетов будет добавлен в следующих итерациях.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-duties">
            <Card>
              <CardHeader>
                <CardTitle>Мои дежурства</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Персональный раздел дежурств будет добавлен в следующих
                  итерациях.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
