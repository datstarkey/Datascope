import { IUser } from "./../Interfaces/IUser";

export async function Register(user: IUser) {
  const response = await fetch("/login/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.ok;
}

export async function Login(user: IUser) {
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
}

export async function RefreshLogin(token: string) {
  const response = await fetch("/login/refresh", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
