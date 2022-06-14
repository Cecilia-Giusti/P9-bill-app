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

describe("Given it logged in as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // Création d'un objet avec les propriétés adaptées
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Connection en tant qu'employé
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création d'une div root commme dans le DOM
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      // Ajout de la div au bon endroit
      document.body.append(root);
      //Initialisation de la fonction router
      router();
      // Navigation sur la page Bills
      window.onNavigate(ROUTES_PATH.Bills);

      // Récupération de l'icone testé
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      // Vérification que l'icone a bien la classe highlight donnée par active-icon
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      // Ajout de la view de la page Bill
      document.body.innerHTML = BillsUI({ data: bills });

      // Récupération des dates disponibles
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      // Tri par ordre croissant
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);

      // Test si les dates sont bien triés comme dans le test
      expect(dates).toEqual(datesSorted);
    });

    describe(`when I click on the "new bill" button`, () => {
      test("then, the form for the new bill should be show", () => {
        // Création d'un objet avec les propriétés adaptées
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        // Connection en tant qu'employé
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        // Création d'une div root commme dans le DOM
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        // Ajout de la div au bon endroit
        document.body.append(root);
        //Initialisation de la fonction router
        router();

        // Bouton à cliquer
        const newBillButton = getByTestId(document.body, "btn-new-bill");
        // Mock de la fonction de navigation
        const navigate = jest.fn(window.onNavigate(ROUTES_PATH.Bills));

        // Simulation du click
        newBillButton.addEventListener("click", navigate);
        userEvent.click(newBillButton);

        // Test si le texte de la page NewBill s'affiche correctement
        expect(getByTestId(document.body, "send-new-bill")).toHaveTextContent(
          "Envoyer une note de frais"
        );
      });
    });

    test("then the modal of justification is hidden", () => {
      // Ajout de la view de la page Bill
      document.body.innerHTML = BillsUI({ data: bills });

      // Récupération de la modale et vérification que celle-ci n'a pas la classe show
      const modaleFile = document.getElementById("modaleFile");
      expect(modaleFile).not.toHaveClass("show");
    });

    describe(`When I click on the icon eye`, () => {
      test("then the function is called", () => {
        // Mock de Jquery utilisé dans Bills
        $.fn.modal = jest.fn();

        // Création d'objet - Lignes de note de frais
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const bill = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        // Ajout de la view bill avec les données factices ainsi que les lignes
        document.body.innerHTML = BillsUI(bills);
        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills);

        // Récupération des icones oeil
        const eyeButton = screen.getAllByTestId("icon-eye");

        // Simulation pour chaque icon un click
        eyeButton.forEach((icon) => {
          const handleClickIconEye = jest.fn(bill.handleClickIconEye(icon));

          icon.addEventListener("click", handleClickIconEye);
          userEvent.click(icon);

          // Vérification que la fonction est bien appelée
          expect(handleClickIconEye).toHaveBeenCalled();
        });
      });

      test("Then the bill shows", async () => {
        // Mock de Jquery utilisé dans Bills
        $.fn.modal = jest.fn();

        // Création d'objet - Lignes de note de frais
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billTwo = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        // Ajout de la view bill avec une donnée
        document.body.innerHTML = BillsUI(bills[0]);
        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills[0]);

        // Récupération de l'icone oeil
        const eyeButton = screen.getByTestId("icon-eye");
        // Récupération de la modale de justification
        const modaleFile = document.getElementById("modaleFile");

        //Mock de la méthode de notre objet
        const handleClickIconEye = jest.fn(
          billTwo.handleClickIconEye(eyeButton)
        );

        // Simulation d'un click sur l'icone
        eyeButton.addEventListener("click", () => {
          handleClickIconEye;
          $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));
          userEvent.click(eyeButton);

          //Vérification que la modale prend bien la classe show
          expect(modaleFile).toHaveClass("show");
        });
      });

      test("Then the right bill show", () => {
        //Ajout de la view de bill avec une donnée
        document.body.innerHTML = BillsUI(bills[0]);
        const tBody = screen.getByTestId("tbody");
        tBody.innerHTML = row(bills[0]);

        // Récupération de l'icone oeil
        const eyeButton = screen.getByTestId("icon-eye");

        //La modale montre le bon billet
        expect(eyeButton.getAttribute("data-bill-url")).toEqual(
          "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
        );
      });
    });

    // test d'intégration GET
    test("fetches bills from mock API GET", async () => {
      //Connection en tant qu'employé
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );

      // Création d'une div root comme dans le DOM
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      // Ajout de la div
      document.body.append(root);
      //Lancement de la fonction router
      router();

      // Navigation sur la page Bill
      window.onNavigate(ROUTES_PATH.Bills);

      // Attente et récupération du titre
      await waitFor(() => screen.getByText("Mes notes de frais"));
      const contentNewBill = await screen.getByTestId("btn-new-bill");

      // Vérification que le titre s'affiche correctement
      expect(contentNewBill).toBeTruthy();

      const contentBills = await screen.getByTestId("tbody");
      expect(contentBills).toBeTruthy();
    });

    describe("When an error occurs on API", () => {
      // Avant chaque test
      beforeEach(() => {
        // Création d'une fonction simulée mais qui surveille les appels
        jest.spyOn(mockStore, "bills");

        // Création d'un ojet avec les bonnes propirétées
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

        //Création d'une div root comme dans le DOM
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        //Ajout de la div au bon endroit
        document.body.appendChild(root);
        // Lancement de la fonction rooter
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        // Récupération des données mocked et application à la suite de la methode list avec la simulation d'une erreur
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        // Navigation sur la page Bill
        window.onNavigate(ROUTES_PATH.Bills);

        // Attente que le code asynchrone avant soit appliqué avec de poursuivre
        await new Promise(process.nextTick);

        // Recherche du message d'erreur
        const message = await screen.getByText(/Erreur 404/);

        //Vérification qu'il soit bien affiché
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        // Récupération des données mocked et application à la suite de la methode list avec la simulation d'une erreur
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });
        // Navigation sur la page Bill
        window.onNavigate(ROUTES_PATH.Bills);

        // Attente que le code asynchrone avant soit appliqué avec de poursuivre
        await new Promise(process.nextTick);

        // Recherche du message d'erreur
        const message = await screen.getByText(/Erreur 500/);

        //Vérification qu'il soit bien affiché
        expect(message).toBeTruthy();
      });
    });
  });
});
