import { IGame } from "../Interfaces/IGame";

export async function GetGameList(): Promise<IGame[]> {
  const response = await fetch("/GamesList");
  try {
    const body = await response.json();
    return body;
  } catch {
    console.log(response);
    return [];
  }
}

export async function UpdateGame(game: IGame, token: string): Promise<boolean> {
  const response = await fetch("/GamesList", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(game),
  });

  return response.ok;
}

export async function DeleteGame(game: IGame, token: string): Promise<boolean> {
  const response = await fetch("/GamesList", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(game),
  });

  return response.ok;
}
