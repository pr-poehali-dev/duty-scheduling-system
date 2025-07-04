import { useState, useEffect } from "react";
import { Dejurstvo, User, Otdel } from "@/contexts/AuthContext";

// Mock данные для демонстрации SQL интеграции
const mockDuties: Dejurstvo[] = [
  {
    id: 1,
    otdel: 1,
    data: "2025-01-06",
    id_u: 2,
    user_fio: "Иванова Анна Сергеевна",
    approved: true,
  },
  {
    id: 2,
    otdel: 1,
    data: "2025-01-07",
    id_u: 2,
    user_fio: "Иванова Анна Сергеевна",
    approved: false,
  },
  {
    id: 3,
    otdel: 2,
    data: "2025-01-06",
    id_u: 3,
    user_fio: "Петров Михаил Александрович",
    approved: true,
  },
  {
    id: 4,
    otdel: 2,
    data: "2025-01-08",
    id_u: 3,
    user_fio: "Петров Михаил Александрович",
    approved: false,
  },
  {
    id: 5,
    otdel: 3,
    data: "2025-01-06",
    id_u: 5,
    user_fio: "Сидоров Андрей Николаевич",
    approved: true,
  },
  {
    id: 6,
    otdel: 4,
    data: "2025-01-07",
    id_u: 6,
    user_fio: "Козлов Константин Константинович",
    approved: false,
  },
];

const mockUsers: User[] = [
  {
    id_u: 1,
    fio: "Иванов Иван Иванович",
    otdel: 1,
    specialnost: "Заведующий отделением",
    telefon: "+7 (999) 123-45-67",
    isRukovod: true,
  },
  {
    id_u: 2,
    fio: "Иванова Анна Сергеевна",
    otdel: 1,
    specialnost: "Терапевт",
    telefon: "+7 (999) 234-56-78",
    isRukovod: false,
  },
  {
    id_u: 3,
    fio: "Петров Михаил Александрович",
    otdel: 2,
    specialnost: "Хирург",
    telefon: "+7 (999) 345-67-89",
    isRukovod: false,
  },
  {
    id_u: 4,
    fio: "Петрова Елена Викторовна",
    otdel: 2,
    specialnost: "Заведующий отделением",
    telefon: "+7 (999) 456-78-90",
    isRukovod: true,
  },
  {
    id_u: 5,
    fio: "Сидоров Андрей Николаевич",
    otdel: 3,
    specialnost: "Кардиолог",
    telefon: "+7 (999) 567-89-01",
    isRukovod: false,
  },
  {
    id_u: 6,
    fio: "Козлов Константин Константинович",
    otdel: 4,
    specialnost: "Невролог",
    telefon: "+7 (999) 678-90-12",
    isRukovod: false,
  },
];

export const useDutyData = () => {
  const [duties, setDuties] = useState<Dejurstvo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Симуляция SQL запросов
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Имитация задержки SQL запроса
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDuties(mockDuties);
      setUsers(mockUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Получение дежурств по отделению
  const getDutiesByOtdel = (
    otdelId: number,
    weekOffset: number = 0,
  ): Dejurstvo[] => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return duties.filter((duty) => {
      const dutyDate = new Date(duty.data);
      return (
        duty.otdel === otdelId && dutyDate >= startDate && dutyDate <= endDate
      );
    });
  };

  // Получение дежурств на месяц
  const getDutiesForMonth = (
    year: number,
    month: number,
    otdelId?: number,
  ): Dejurstvo[] => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return duties.filter((duty) => {
      const dutyDate = new Date(duty.data);
      const matchesOtdel = otdelId ? duty.otdel === otdelId : true;
      return matchesOtdel && dutyDate >= startDate && dutyDate <= endDate;
    });
  };

  // Получение пользователей по отделению
  const getUsersByOtdel = (otdelId: number): User[] => {
    return users.filter((user) => user.otdel === otdelId);
  };

  // Взятие дежурства
  const takeDuty = async (
    otdelId: number,
    date: string,
    userId: number,
  ): Promise<boolean> => {
    try {
      // Имитация SQL INSERT
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newDuty: Dejurstvo = {
        id: Date.now(),
        otdel: otdelId,
        data: date,
        id_u: userId,
        user_fio: users.find((u) => u.id_u === userId)?.fio || "",
        approved: false,
      };

      setDuties((prev) => [...prev, newDuty]);
      return true;
    } catch (error) {
      console.error("Ошибка при взятии дежурства:", error);
      return false;
    }
  };

  // Отмена дежурства
  const cancelDuty = async (dutyId: number): Promise<boolean> => {
    try {
      // Имитация SQL DELETE
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDuties((prev) => prev.filter((duty) => duty.id !== dutyId));
      return true;
    } catch (error) {
      console.error("Ошибка при отмене дежурства:", error);
      return false;
    }
  };

  // Утверждение дежурства (только для руководителей)
  const approveDuty = async (dutyId: number): Promise<boolean> => {
    try {
      // Имитация SQL UPDATE
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDuties((prev) =>
        prev.map((duty) =>
          duty.id === dutyId ? { ...duty, approved: true } : duty,
        ),
      );
      return true;
    } catch (error) {
      console.error("Ошибка при утверждении дежурства:", error);
      return false;
    }
  };

  // Назначение дежурства (только для руководителей)
  const assignDuty = async (
    otdelId: number,
    date: string,
    userId: number,
  ): Promise<boolean> => {
    try {
      // Имитация SQL INSERT с approved = true
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newDuty: Dejurstvo = {
        id: Date.now(),
        otdel: otdelId,
        data: date,
        id_u: userId,
        user_fio: users.find((u) => u.id_u === userId)?.fio || "",
        approved: true,
      };

      setDuties((prev) => [...prev, newDuty]);
      return true;
    } catch (error) {
      console.error("Ошибка при назначении дежурства:", error);
      return false;
    }
  };

  return {
    duties,
    users,
    loading,
    getDutiesByOtdel,
    getDutiesForMonth,
    getUsersByOtdel,
    takeDuty,
    cancelDuty,
    approveDuty,
    assignDuty,
  };
};
