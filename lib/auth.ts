// lib/auth.ts
export interface User {
  username: string;
  password: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface Credentials {
  users: User[];
}

// Credenciais iniciais
const defaultCredentials: Credentials = {
  users: [
    {
      username: "admin",
      password: "admin123",
      email: "admin@example.com"
    },
    {
      username: "user",
      password: "user123",
      email: "user@example.com"
    }
  ]
};

// Chaves para localStorage
const LOCAL_STORAGE_KEYS = {
  USERS: "auth_users",
  TOKEN: "auth_token"
};

// Simula delay de API
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Recupera usuários do localStorage
const getLocalUsers = (): User[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao ler usuários do localStorage:", error);
    return [];
  }
};

// Salva todos os usuários no localStorage
const saveAllUsers = (users: User[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Erro ao salvar usuários no localStorage:", error);
  }
};

// Retorna todos os usuários (default + localStorage)
const getAllUsers = (): User[] => {
  return [...defaultCredentials.users, ...getLocalUsers()];
};

// Valida se um usuário já existe
// (Removido: declaração duplicada de userExists)

// Autentica um usuário
export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  await simulateDelay(1000);

  const users = getAllUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return {
      success: false,
      message: "Credenciais inválidas"
    };
  }

  login(user.email);
  return {
    success: true,
    message: "Login bem-sucedido",
    user
  };
};


// Funções de autenticação
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
};

export const login = (token: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
};

export const logout = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
};

// Funções de desenvolvimento (opcional)
export const clearAuthData = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USERS);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
};

export const getAllRegisteredUsers = (): User[] => {
  return getAllUsers();
};

export const isStrongPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,}$/;
  return regex.test(password);
};


// (Removed duplicate getAllUsers and registerUser implementation)

export interface User {
  username: string; // Mantenha como username para consistência
  password: string;
  email: string;
}

// ... (o resto das interfaces permanece igual)

// Valida se um usuário já existe (versão melhorada)
// (Removido: declaração duplicada de userExists)


// Adicione esta função de validação de email
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// lib/auth.ts (função userExists atualizada)
const userExists = (username: string, email: string): { username: boolean; email: boolean } => {
  const users = getAllUsers();
  return {
    username: users.some(u => u.username.toLowerCase() === username.toLowerCase()),
    email: users.some(u => u.email.toLowerCase() === email.toLowerCase())
  };
};

// Atualize a função registerUser
export const registerUser = async (
  username: string,
  password: string,
  email: string
): Promise<AuthResponse> => {
  await simulateDelay(1000);

  if (typeof window === 'undefined') {
    return { success: false, message: "Funcionalidade disponível apenas no cliente" };
  }

  if (!username || !password || !email) {
    return { success: false, message: "Todos os campos são obrigatórios" };
  }

  if (!validateEmail(email)) {
    return { success: false, message: "Email inválido" };
  }

  const exists = userExists(username, email);

  if (exists.username && exists.email) {
    return { 
      success: false, 
      message: "Nome de usuário e e-mail já estão em uso" 
    };
  }

  if (exists.username) {
    return { 
      success: false, 
      message: "Nome de usuário já está em uso" 
    };
  }

  if (exists.email) {
    return { 
      success: false, 
      message: "E-mail já está em uso" 
    };
  }

  const newUser = { username, password, email };
  const localUsers = getLocalUsers();
  saveAllUsers([...localUsers, newUser]);

  return {
    success: true,
    message: "Usuário registrado com sucesso!",
    user: newUser
  };
};