import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id_u: number;
  fio: string;
  otdel: number;
  specialnost: string;
  telefon: string;
  isRukovod: boolean;
}

export interface Otdel {
  id_o: number;
  name_o: string;
  rukovod: string;
}

export interface Dejurstvo {
  id: number;
  otdel: number;
  data: string;
  id_u: number;
  user_fio?: string;
  approved?: boolean;
}

interface AuthContextType {
  user: User | null;
  otdels: Otdel[];
  login: (fio: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock данные для демонстрации - в реальном проекте будут из SQL
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

const mockOtdels: Otdel[] = [
  {
    id_o: 1,
    name_o: "Терапевтическое отделение",
    rukovod: "Иванов Иван Иванович",
  },
  {
    id_o: 2,
    name_o: "Хирургическое отделение",
    rukovod: "Петрова Елена Викторовна",
  },
  {
    id_o: 3,
    name_o: "Кардиологическое отделение",
    rukovod: "Сидоров Сергей Сергеевич",
  },
  {
    id_o: 4,
    name_o: "Неврологическое отделение",
    rukovod: "Козлов Кирилл Кириллович",
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (fio: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Имитация запроса к SQL базе
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Поиск пользователя по ФИО (в реальном проекте будет SQL запрос)
    const foundUser = mockUsers.find((u) => u.fio === fio);

    if (foundUser && password === "123456") {
      // Демо пароль
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    otdels: mockOtdels,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
