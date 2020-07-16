import React from "react";
import { shallow, mount } from "enzyme";
import { GameModal } from "./GameModal";
import { FakeGame1 } from "../setupTests";

describe("Modal Testing", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        addListener: jest.fn(), // deprecated but causes error
        removeListener: jest.fn(), // deprecated but causes error
      })),
    });
  });

  it("Open modal on click", () => {
    const wrapper = shallow(<GameModal />);
    var modal = wrapper.find(".ant-modal-mask-hidden");
    expect(modal).toBeInTheDocument;

    const button = wrapper.find("#modal-open-button");
    button.simulate("click");

    modal = wrapper.find(".ant-modal-mask-hidden");
    expect(modal).toBeNull;
  });

  it("preloads game data if given for edit", () => {
    //inject a fake game;
    const wrapper = mount(<GameModal update={true} game={FakeGame1} title="Edit" />);
    wrapper.find("#modal-open-button").first().simulate("click");

    const nameForm = wrapper.find("#name-input").first();
    expect(nameForm.props().value).toBe(FakeGame1.name);

    const descripForm = wrapper.find("#description-input").first();
    expect(descripForm.text()).toBe(FakeGame1.description);

    const ratingForm = wrapper.find(".ant-select-selection-item").first();
    expect(ratingForm.props().title).toBe(FakeGame1.rating.toString());

    //have to convert to miliseconds to get accurate assert
    const releaseForm = wrapper.find("#release-input").first();
    const value: string = releaseForm.props().value?.toString() || "";
    expect(Date.parse(value)).toBe(Date.parse(FakeGame1.releaseDate.toString()));
  });
});
