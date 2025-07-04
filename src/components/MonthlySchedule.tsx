import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useDutyData } from "@/hooks/useDutyData";
import Icon from "@/components/ui/icon";

interface MonthlyScheduleProps {
  selectedDepartment: number;
}

const MonthlySchedule: React.FC<MonthlyScheduleProps> = ({
  selectedDepartment,
}) => {
  const { user, otdels } = useAuth();
  const {
    users,
    getDutiesForMonth,
    getUsersByOtdel,
    assignDuty,
    approveDuty,
    cancelDuty,
  } = useDutyData();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const currentOtdel = otdels.find((o) => o.id_o === selectedDepartment);
  const departmentUsers = getUsersByOtdel(selectedDepartment);
  const monthDuties = getDutiesForMonth(
    currentYear,
    currentMonth,
    selectedDepartment,
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const handleAssignDuty = async () => {
    if (!selectedUser || !selectedDate) return;

    setActionLoading(true);
    try {
      await assignDuty(selectedDepartment, selectedDate, Number(selectedUser));
      setShowAssignDialog(false);
      setSelectedDate("");
      setSelectedUser("");
    } catch (error) {
      console.error("Ошибка при назначении дежурства:", error);
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

  const getDutiesForDate = (date: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return monthDuties.filter((duty) => duty.data === dateString);
  };

  const handlePrint = () => {
    window.print();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Icon name="Calendar" className="h-5 w-5 mr-2 text-blue-600" />
              График дежурств - {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <Icon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <Icon name="ChevronRight" className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Icon name="Printer" className="h-4 w-4 mr-2" />
                Печать
              </Button>
              {user?.isRukovod && (
                <Dialog
                  open={showAssignDialog}
                  onOpenChange={setShowAssignDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="UserPlus" className="h-4 w-4 mr-2" />
                      Назначить дежурство
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Назначить дежурство</DialogTitle>
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
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Сотрудник:
                        </label>
                        <Select
                          value={selectedUser}
                          onValueChange={setSelectedUser}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сотрудника" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentUsers.map((user) => (
                              <SelectItem
                                key={user.id_u}
                                value={user.id_u.toString()}
                              >
                                {user.fio} - {user.specialnost}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleAssignDuty}
                          disabled={
                            !selectedDate || !selectedUser || actionLoading
                          }
                        >
                          {actionLoading
                            ? "Назначение..."
                            : "Назначить дежурство"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAssignDialog(false)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Пустые ячейки для выравнивания первой недели */}
            {Array.from(
              { length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 },
              (_, i) => (
                <div key={`empty-${i}`} className="p-2 min-h-20"></div>
              ),
            )}

            {/* Дни месяца */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = i + 1;
              const dayDuties = getDutiesForDate(date);
              const isToday =
                new Date().getDate() === date &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <div
                  key={date}
                  className={`border rounded-lg p-2 min-h-20 ${
                    isToday ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isToday ? "text-blue-600" : "text-slate-900"
                    }`}
                  >
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dayDuties.map((duty) => {
                      const dutyUser = users.find((u) => u.id_u === duty.id_u);
                      return (
                        <div
                          key={duty.id}
                          className={`text-xs p-1 rounded border-l-2 ${
                            duty.approved
                              ? "bg-green-50 border-green-600 text-green-800"
                              : "bg-yellow-50 border-yellow-600 text-yellow-800"
                          }`}
                        >
                          <div className="font-medium truncate">
                            {dutyUser?.fio.split(" ")[0]}{" "}
                            {dutyUser?.fio.split(" ")[1]?.[0]}.
                          </div>
                          {user?.isRukovod && (
                            <div className="flex space-x-1 mt-1">
                              {!duty.approved && (
                                <button
                                  onClick={() => handleApproveDuty(duty.id)}
                                  className="text-xs bg-green-600 text-white px-1 py-0.5 rounded hover:bg-green-700"
                                  disabled={actionLoading}
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelDuty(duty.id)}
                                className="text-xs bg-red-600 text-white px-1 py-0.5 rounded hover:bg-red-700"
                                disabled={actionLoading}
                              >
                                ✕
                              </button>
                            </div>
                          )}
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

      {/* Статистика и легенда */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Статистика дежурств</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Всего дежурств:</span>
                <span className="font-medium">{monthDuties.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Утверждено:</span>
                <span className="font-medium text-green-600">
                  {monthDuties.filter((d) => d.approved).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Ожидает утверждения:
                </span>
                <span className="font-medium text-yellow-600">
                  {monthDuties.filter((d) => !d.approved).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Легенда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-50 border-l-2 border-green-600 rounded"></div>
                <span className="text-sm">Утвержденное дежурство</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-50 border-l-2 border-yellow-600 rounded"></div>
                <span className="text-sm">Ожидает утверждения</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span className="text-sm">Сегодня</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список сотрудников отделения */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сотрудники отделения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentUsers.map((person) => {
              const userDuties = monthDuties.filter(
                (duty) => duty.id_u === person.id_u,
              );

              return (
                <div
                  key={person.id_u}
                  className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                >
                  <Avatar>
                    <AvatarFallback className="bg-slate-600 text-white">
                      {person.fio
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{person.fio}</p>
                    <p className="text-sm text-slate-600">
                      {person.specialnost}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {userDuties.length} дежурств
                      </Badge>
                      {person.isRukovod && (
                        <Badge variant="outline" className="text-xs">
                          Руководитель
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySchedule;
