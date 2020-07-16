import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App", () => {
  it("renders correctly", () => {
    shallow(<App />);
  });

  it("containers logo", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("img").hasClass("logo")).toBeTruthy;
  });
});
