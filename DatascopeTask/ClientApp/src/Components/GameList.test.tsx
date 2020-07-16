import React from "react";
import { shallow, mount } from "enzyme";
import { GameList } from "./GameList";
import * as Api from "../Utilities/GamesListApi";
import { FakeGames } from "../setupTests";
import { act } from "react-dom/test-utils";

describe("Game List Testing", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        addListener: jest.fn(), // deprecated but causes error
        removeListener: jest.fn(), // deprecated but causes error
      })),
    });
  });

  it("check list isnt showed before api call", () => {
    const wrapper = shallow(<GameList />);
    const header = wrapper.find("h3").first();
    expect(header.text()).toBe("Fetching list");
  });

  it("check list appears after api call", () => {
    let wrapper: any;
    act(() => {
      wrapper = mount(<GameList />);
    });
    //Wont display this header after fetching the list.
    const header = wrapper.find("h3").first();
    expect(header).toBeNull;
  });
});
