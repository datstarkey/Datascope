import React, { useContext } from "react";
import { IGame } from "../Interfaces/IGame";
import { SuccessToast, DangerToast } from "../Utilities/ToastMessage";
import { Card, Button } from "antd";
import { DeleteGame } from "../Utilities/GamesListApi";
import { GameModal } from "./GameModal";
import { AppContext } from "./Context/Context";

type GameProps = {
  game: IGame;
  refreshList: () => void;
};

export const GameDetails = (props: GameProps) => {
  const context = useContext(AppContext);
  const token: string = context.bearer || "";

  const deleteClick = () => {
    DeleteGame(props.game, token).then((success) => {
      if (success) {
        SuccessToast("Success", "Game deleted successfully");
        props.refreshList();
      } else {
        DangerToast("Error", "Could not connect to database, please check connection");
      }
    });
  };

  const getDateString = (date: Date): string => new Date(date).toDateString();

  return (
    <>
      <Card
        title={props.game.name}
        className="card-width"
        headStyle={{ color: "white", background: "#002766" }}
        bodyStyle={{ background: "#fafafa" }}
      >
        <table>
          <tbody>
            <tr>
              <td style={{ width: 100 }}>
                <p>Rating : </p>
              </td>
              <td>
                <p id="rating">{props.game.rating}</p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Release Date : </p>
              </td>
              <td>
                <p id="release-date">{getDateString(props.game.releaseDate)}</p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Description : </p>
              </td>
              <td>
                <p id="description" style={{ fontSize: 11 }}>
                  {props.game.description}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        {context.authenticated && <GameModal update={true} game={props.game} title="Edit" refreshList={props.refreshList} />}
        {context.authenticated && (
          <Button type="primary" danger style={{ marginLeft: 5 }} onClick={deleteClick}>
            Delete
          </Button>
        )}
      </Card>
    </>
  );
};
