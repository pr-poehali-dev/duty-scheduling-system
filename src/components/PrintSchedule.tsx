import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDutyData } from "@/hooks/useDutyData";

interface PrintScheduleProps {
  selectedDepartment: number;
  currentMonth: number;
  currentYear: number;
}

const PrintSchedule: React.FC<PrintScheduleProps> = ({
  selectedDepartment,
  currentMonth,
  currentYear,
}) => {
  const { otdels } = useAuth();
  const { users, getDutiesForMonth, getUsersByOtdel } = useDutyData();

  const currentOtdel = otdels.find((o) => o.id_o === selectedDepartment);
  const departmentUsers = getUsersByOtdel(selectedDepartment);
  const monthDuties = getDutiesForMonth(
    currentYear,
    currentMonth,
    selectedDepartment,
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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

  const getDutiesForDate = (date: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return monthDuties.filter((duty) => duty.data === dateString);
  };

  return (
    <div className="print-only p-6 bg-white" style={{ display: "none" }}>
      <style jsx>{`
        @media print {
          .print-only {
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
          body {
            font-size: 12px;
            line-height: 1.4;
          }
        }
      `}</style>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">ГРАФИК ДЕЖУРСТВ</h1>
        <h2 className="text-lg font-semibold mb-1">{currentOtdel?.name_o}</h2>
        <h3 className="text-base">
          {monthNames[currentMonth]} {currentYear} г.
        </h3>
      </div>

      <table className="w-full border-collapse border border-gray-400 mb-6">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 text-center font-bold">
              Дата
            </th>
            <th className="border border-gray-400 p-2 text-center font-bold">
              ФИО дежурного
            </th>
            <th className="border border-gray-400 p-2 text-center font-bold">
              Специальность
            </th>
            <th className="border border-gray-400 p-2 text-center font-bold">
              Телефон
            </th>
            <th className="border border-gray-400 p-2 text-center font-bold">
              Статус
            </th>
            <th className="border border-gray-400 p-2 text-center font-bold">
              Подпись
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1;
            const dayDuties = getDutiesForDate(date);
            const dateStr = `${String(date).padStart(2, "0")}.${String(currentMonth + 1).padStart(2, "0")}.${currentYear}`;

            if (dayDuties.length === 0) {
              return (
                <tr key={date}>
                  <td className="border border-gray-400 p-2 text-center">
                    {dateStr}
                  </td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                </tr>
              );
            }

            return dayDuties.map((duty, idx) => {
              const dutyUser = users.find((u) => u.id_u === duty.id_u);
              return (
                <tr key={`${date}-${idx}`}>
                  <td className="border border-gray-400 p-2 text-center">
                    {idx === 0 ? dateStr : ""}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {dutyUser?.fio}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {dutyUser?.specialnost}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {dutyUser?.telefon}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {duty.approved ? "Утверждено" : "Не утверждено"}
                  </td>
                  <td className="border border-gray-400 p-2"></td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Статистика дежурств:</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Всего дежурств:</span>{" "}
            {monthDuties.length}
          </div>
          <div>
            <span className="font-medium">Утверждено:</span>{" "}
            {monthDuties.filter((d) => d.approved).length}
          </div>
          <div>
            <span className="font-medium">Ожидает утверждения:</span>{" "}
            {monthDuties.filter((d) => !d.approved).length}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Состав отделения:</h3>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 text-center font-bold">
                №
              </th>
              <th className="border border-gray-400 p-2 text-center font-bold">
                ФИО
              </th>
              <th className="border border-gray-400 p-2 text-center font-bold">
                Специальность
              </th>
              <th className="border border-gray-400 p-2 text-center font-bold">
                Телефон
              </th>
              <th className="border border-gray-400 p-2 text-center font-bold">
                Дежурств в месяце
              </th>
            </tr>
          </thead>
          <tbody>
            {departmentUsers.map((person, index) => {
              const userDuties = monthDuties.filter(
                (duty) => duty.id_u === person.id_u,
              );
              return (
                <tr key={person.id_u}>
                  <td className="border border-gray-400 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 p-2">{person.fio}</td>
                  <td className="border border-gray-400 p-2">
                    {person.specialnost}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {person.telefon}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {userDuties.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end mt-8">
        <div className="text-center">
          <p className="mb-8">Заведующий отделением</p>
          <p className="border-b border-gray-400 w-48 text-center">
            {currentOtdel?.rukovod}
          </p>
          <p className="mt-2 text-sm">(подпись)</p>
        </div>
        <div className="text-center">
          <p className="mb-8">Дата утверждения</p>
          <p className="border-b border-gray-400 w-32 text-center">
            «___» {monthNames[currentMonth]} {currentYear} г.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintSchedule;
