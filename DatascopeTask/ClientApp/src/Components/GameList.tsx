import React, { useState, useEffect, useContext } from "react";
import { GetGameList } from "../Utilities/GamesListApi";
import { AppContext } from "./Context/Context";
import { IGame } from "../Interfaces/IGame";
import { GameModal } from "./GameModal";
import { GameDetails } from "./GameDetails";

export const GameList = () => {
  const [list, setList] = useState<IGame[]>([]);
  const [gottenList, setGottenList] = useState<boolean>(false);
  const context = useContext(AppContext);

  const getGameList = () => {
    GetGameList().then((result) => {
      setGottenList(true);
      setList(result);
    });
  };

  useEffect(() => getGameList(), []);

  return (
    <>
      {context.authenticated && (
        <div style={{ marginLeft: "2rem" }}>
          <GameModal refreshList={getGameList} data-testid="new-game-button" />
        </div>
      )}

      {gottenList ? <h3 style={{ marginLeft: "2rem", marginTop: "2rem" }}>The List</h3> : <h3>Fetching list</h3>}
      <div className="grid" data-testid="game-grid">
        {list.map((item: IGame, index) => (
          <div key={index} className="grid-item" id={`grid-item-${index}`}>
            <GameDetails game={item} refreshList={() => getGameList()} />
          </div>
        ))}
      </div>
    </>
  );
};
