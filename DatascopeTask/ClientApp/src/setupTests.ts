import { IGame } from "./Interfaces/IGame";
import "@testing-library/jest-dom/extend-expect";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

const id = 0,
  name = "fakeGame1",
  description = "a descsription",
  rating = 1,
  releaseDate = new Date();

export const FakeGame1: IGame = {
  id: id,
  name: name,
  description: description,
  rating: rating,
  releaseDate: releaseDate,
};

const FakeGame2: IGame = {
  id: id + 1,
  name: "second game",
  description: "A cool description",
  rating: 6,
  releaseDate: new Date(),
};

export const FakeGames: IGame[] = [FakeGame1, FakeGame2];
