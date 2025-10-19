export type User = {
  id: number;
  name: string;
  email: string;
};

const DATA_URL = "/data.json";

export async function getUsers(): Promise<User[]> {
  try {
    const stored = localStorage.getItem("users");
    if (stored) {
      return JSON.parse(stored) as User[];
    }

    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("Failed to load data.json");
    const data = (await res.json()) as User[];

    localStorage.setItem("users", JSON.stringify(data));
    return data;
  } catch {
    return [];
  }
}

export async function getUserById(id: number | string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === Number(id));
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    id: Date.now(),
    ...user,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return newUser;
}

export async function updateUser(updatedUser: User): Promise<User> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);

  if (index === -1) {
    throw new Error(`User with id ${updatedUser.id} not found`);
  }

  users[index] = updatedUser;
  localStorage.setItem("users", JSON.stringify(users));
  return updatedUser;
}

export async function deleteUser(id: number | string): Promise<void> {
  const users = await getUsers();
  const filtered = users.filter((u) => u.id !== Number(id));
  localStorage.setItem("users", JSON.stringify(filtered));
}

export function resetUsers(): void {
  localStorage.removeItem("users");
}
