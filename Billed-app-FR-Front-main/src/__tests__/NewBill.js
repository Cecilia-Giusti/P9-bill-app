/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import NewBill from "../containers/NewBill.js";

jest.mock("../app/store", () => mockStore);

describe("Given it logged in as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When, I click on submit", () => {
      test("the submit should be send", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();

        document.body.innerHTML = NewBillUI();

        const newBillObject = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBillObject.handleSubmit(e));

        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);

        expect(handleSubmit).toHaveBeenCalled();
      });
    });
    describe("When I upload a file with a right extension", () => {
      test("Then the file should be uploaded", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();

        document.body.innerHTML = NewBillUI();

        const newBillObject2 = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const file = screen.getByTestId("file");
        const handleChangeFile = jest.fn((e) =>
          newBillObject2.handleChangeFile(e)
        );

        file.addEventListener("change", handleChangeFile);
        fireEvent.change(file, {
          target: {
            files: [new File(["Test"], "test.png")],
          },
        });
        expect(handleChangeFile).toHaveBeenCalled();
      });
    });
  });
});
