/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { row } from "../views/BillsUI.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    describe(`when I click on the "new bill" button`, () => {
      test("then, the form for the new expense report is displayed", () => {
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
        window.onNavigate(ROUTES_PATH.Bills);

        const newBillButton = getByTestId(document.body, "btn-new-bill");
        userEvent.click(newBillButton);

        expect(getByTestId(document.body, "send-new-bill")).toHaveTextContent(
          "Envoyer une note de frais"
        );
      });
    });

    test("then the modal of justification is hidden", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const modaleFile = document.getElementById("modaleFile");
      expect(modaleFile).not.toHaveClass("show");
    });

    describe(`When I click on the icon eye`, () => {
      test("then the function is called", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        $.fn.modal = jest.fn();

        const store = null;
        const bill = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        document.body.innerHTML = BillsUI(bills);

        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills);
        const eyeButton = screen.getAllByTestId("icon-eye");

        eyeButton.forEach((icon) => {
          const handleClickIconEye = jest.fn(bill.handleClickIconEye(icon));

          icon.addEventListener("click", handleClickIconEye);
          userEvent.click(icon);

          // La fonction est bien appelée
          expect(handleClickIconEye).toHaveBeenCalled();
        });
      });

      test("Then the bill shows", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        $.fn.modal = jest.fn();

        const store = null;
        const billTwo = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        document.body.innerHTML = BillsUI(bills[0]);

        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills[0]);

        const eyeButton = screen.getByTestId("icon-eye");
        const modaleFile = document.getElementById("modaleFile");

        const handleClickIconEye = jest.fn(
          billTwo.handleClickIconEye(eyeButton)
        );

        eyeButton.addEventListener("click", () => {
          handleClickIconEye;
          $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));
          userEvent.click(eyeButton);
          expect(modaleFile).toHaveClass("show");
        });
      });

      test("Then the right bill show", () => {
        document.body.innerHTML = BillsUI(bills[0]);

        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills[0]);
        const eyeButton = screen.getByTestId("icon-eye");

        //La modale montre le bon billet
        expect(eyeButton.getAttribute("data-bill-url")).toEqual(
          "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
        );
      });
    });

    // test d'intégration GET
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
      const contentNewBill = await screen.getByTestId("btn-new-bill");
      expect(contentNewBill).toBeTruthy();

      const contentBills = await screen.getByTestId("tbody");
      expect(contentBills).toBeTruthy();
    });

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
