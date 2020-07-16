import React from "react";
import { shallow } from "enzyme";
import { GameDetails } from "./GameDetails";
import { FakeGame1 } from "../setupTests";

describe("Game Detail Testing", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        addListener: jest.fn(), // deprecated but causes error
        removeListener: jest.fn(), // deprecated but causes error
      })),
    });
  });

  it("form filled out correctly", () => {
    const wrapper = shallow(<GameDetails game={FakeGame1} refreshList={() => {}} />);

    const descripForm = wrapper.find("#description");
    expect(descripForm.text()).toBe(FakeGame1.description);

    const ratingForm = wrapper.find("#rating");
    expect(ratingForm.text()).toBe(FakeGame1.rating.toString());

    //have to convert to miliseconds to get accurate assert
    const releaseForm = wrapper.find("#release-date");
    expect(releaseForm.text()).toBe(FakeGame1.releaseDate.toDateString());
  });
});
