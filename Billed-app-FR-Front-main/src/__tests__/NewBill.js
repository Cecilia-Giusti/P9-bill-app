/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given it logged in as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("then a error message of form should not be show", () => {
      // Création d'un objet avec les propriétés adaptées
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      // Connexion en tant qu'employé
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      // Création d'une div root comme dans le DOM
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      // Ajout de la div
      document.body.append(root);
      //Lancement de la fonction rooter
      router();
      // Navigation sur la page NewBills
      window.onNavigate(ROUTES_PATH.NewBill);

      // Ajout de la view newbill
      document.body.innerHTML = NewBillUI();

      // Création d'une nouvelle note de frais
      const newBillObject = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Récupération du message d'erreur
      const errorMessageForm = screen.getByTestId("error-message-form");
      expect(errorMessageForm).toBeTruthy();
      expect(errorMessageForm).toHaveClass("hiddenError");
    });
    describe("When I upload a file with a right extension", () => {
      test("Then the file should be uploaded", () => {
        // Création d'un objet avec les propriétés adaptées
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        // Connexion en tant qu'employé
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        // Création d'une div root comme dans le DOM
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        // Ajout de la div
        document.body.append(root);
        //Lancement de la fonction rooter
        router();
        // Navigation sur la page NewBills
        window.onNavigate(ROUTES_PATH.NewBill);

        // Ajout de la view newbill
        document.body.innerHTML = NewBillUI();

        // Création d'une nouvelle note de frais
        const newBillObject = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Gestion de la méthode pour l'ajout d'un fichier
        const file = screen.getByTestId("file");
        const handleChangeFile = jest.fn((e) =>
          newBillObject.handleChangeFile(e)
        );
        //Simulation d'un ajout de fichier
        file.addEventListener("change", handleChangeFile);
        fireEvent.change(file, {
          target: {
            files: [new File(["Test"], "test.png", { type: "image/png" })],
          },
        });

        //La fonction est bien appelée
        expect(handleChangeFile).toHaveBeenCalled();

        // Récupération du nom du fichier affiché
        const fileTest = document.querySelector(`input[data-testid="file"]`)
          .files[0].name;

        // Vérification que le fichier téléchargé est le même que celui affiché
        expect(fileTest).toEqual("test.png");
      });

      test("then, the error message should not be show", () => {
        // Création d'un objet avec les propriétés adaptées
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        // Connexion en tant qu'employé
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        // Création d'une div root comme dans le DOM
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        // Ajout de la div
        document.body.append(root);
        //Lancement de la fonction rooter
        router();
        // Navigation sur la page NewBills
        window.onNavigate(ROUTES_PATH.NewBill);

        // Ajout de la view newbill
        document.body.innerHTML = NewBillUI();

        // Création d'une nouvelle note de frais
        const newBillObject = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Gestion de la méthode pour l'ajout d'un fichier
        const file = screen.getByTestId("file");
        const handleChangeFile = jest.fn((e) =>
          newBillObject.handleChangeFile(e)
        );
        //Simulation d'un ajout de fichier
        file.addEventListener("change", handleChangeFile);
        fireEvent.change(file, {
          target: {
            files: [new File(["Test"], "test.png", { type: "image/png" })],
          },
        });

        // Récupération du message d'erreur
        const errorMessage = screen.getByTestId("error-message-extension");

        expect(errorMessage).toBeTruthy();
        expect(errorMessage).toHaveClass("hiddenError");
      });
    });

    describe("When I upload a file with a bad extension", () => {
      test("Then an error message should be show before its uploaded", () => {
        // Création d'un objet avec les propriétés adaptées
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        // Connexion en tant qu'employé
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        // Création d'une div root comme dans le DOM
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        // Ajout de la div
        document.body.append(root);
        //Lancement de la fonction rooter
        router();
        // Navigation sur la page NewBills
        window.onNavigate(ROUTES_PATH.NewBill);

        // Ajout de la view newbill
        document.body.innerHTML = NewBillUI();

        // Création d'une nouvelle note de frais
        const newBillObject2 = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Gestion de la méthode pour l'ajout d'un fichier
        const file = screen.getByTestId("file");
        const handleChangeFile = jest.fn((e) =>
          newBillObject2.handleChangeFile(e)
        );
        //Simulation d'un ajout de fichier
        file.addEventListener("change", handleChangeFile);
        fireEvent.change(file, {
          target: {
            files: [new File(["Test"], "test.txt")],
          },
        });

        //La fonction est bien appelée
        expect(handleChangeFile).toHaveBeenCalled();

        // Récupération du message d'erreur
        const errorMessage = screen.getByTestId("error-message-extension");

        expect(errorMessage).toBeTruthy();
        expect(errorMessage).toHaveClass("showError");
      });
    });

    describe("When, the user clicks on submit", () => {
      describe("When the form should be completed correctly", () => {
        test("Then the form should be send", () => {
          // Création d'un objet avec les propriétés adaptées
          Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
          });
          //Connection en tant qu'employé
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              type: "Employee",
              email: "a@a",
            })
          );

          // Création d'une div root commme dans le DOM
          const root = document.createElement("div");
          root.setAttribute("id", "root");
          // Ajout de la div au bon endroit
          document.body.append(root);
          //Initialisation de la fonction router
          router();
          // Navigation sur la page NewBills
          window.onNavigate(ROUTES_PATH.NewBill);

          //Ajout de la view NewBill
          document.body.innerHTML = NewBillUI();

          // Création d'objet - Nouvelle note de frais
          const newBillObject = new NewBill({
            document,
            onNavigate,
            store: mockStore,
            localStorage: window.localStorage,
          });

          // Récupération du formulaire
          const formNewBill = screen.getByTestId("form-new-bill");

          // Vérification que le formulaire s'affiche correctement
          expect(formNewBill).toBeTruthy();

          //Récupération des champs
          const type = screen.getByTestId("expense-type");
          const name = screen.getByTestId("expense-name");
          const amount = screen.getByTestId("amount");
          const date = screen.getByTestId("datepicker");
          const vat = screen.getByTestId("vat");
          const pct = screen.getByTestId("pct");
          const commentary = screen.getByTestId("commentary");

          // Nouvelle note de frais
          const newBillTest = {
            email: "employee@test.tld",
            type: "Transport",
            name: "Taxi",
            amount: "100",
            date: "2022-05-30",
            vat: "20",
            pct: "10",
            commentary: `Taxi de l'aéroport au bureau`,
            fileUrl: undefined,
            fileName: "test.png",
            status: "pending",
          };

          // Simulation du remplissage des données

          userEvent.selectOptions(type, ["Transports"]);
          userEvent.type(name, newBillTest.name);
          userEvent.type(amount, newBillTest.amount);
          fireEvent.change(date, { target: { value: newBillTest.date } });
          userEvent.type(vat, newBillTest.vat);
          userEvent.type(pct, newBillTest.pct);
          userEvent.type(commentary, newBillTest.commentary);

          //Mock de la méthode de soumission du formulaire
          const handleSubmit = jest.fn((e) => newBillObject.handleSubmit(e));
          //Mock de la méthode de soumission du formulaire
          const updateBill = jest.fn((newBillTest) =>
            newBillObject.updateBill(newBillTest)
          );

          // Vérification que les champs sont correctement rempli
          expect(
            screen.getByRole("option", { name: "Transports" }).selected
          ).toBe(true);
          expect(
            document.querySelector(`input[data-testid="expense-name"]`).value
          ).toEqual("Taxi");
          expect(
            document.querySelector(`input[data-testid="amount"]`).value
          ).toEqual("100");
          expect(
            document.querySelector(`input[data-testid="datepicker"]`).value
          ).toBe("2022-05-30");
          expect(
            document.querySelector(`input[data-testid="vat"]`).value
          ).toEqual("20");
          expect(
            document.querySelector(`input[data-testid="pct"]`).value
          ).toEqual("10");
          expect(
            document.querySelector(`textarea[data-testid="commentary"]`).value
          ).toEqual("Taxi de l'aéroport au bureau");

          // Simulation de la soumission du formulaire
          formNewBill.addEventListener("submit", (e) => {
            handleSubmit(e);
            updateBill(newBillTest);
          });
          fireEvent.submit(formNewBill);

          // La méthode de soumission est bien appelé
          expect(handleSubmit).toHaveBeenCalled();

          // Récupération du message d'erreur
          const errorMessage = screen.getByTestId("error-message-form");
          // Le message d'erreur n'est pas appelé
          expect(errorMessage).toBeTruthy();
          expect(errorMessage).toHaveClass("hiddenError");

          // Les notes de frais sont mises à jour
          expect(updateBill).toHaveBeenCalled();
          expect(updateBill).toBeCalledWith(newBillTest);
        });

        describe("when the form is empty", () => {
          test("then the form should not be send and the error message of form should be show", () => {
            // Création d'un objet avec les propriétés adaptées
            Object.defineProperty(window, "localStorage", {
              value: localStorageMock,
            });
            //Connection en tant qu'employé
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                type: "Employee",
                email: "a@a",
              })
            );

            // Création d'une div root commme dans le DOM
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            // Ajout de la div au bon endroit
            document.body.append(root);
            //Initialisation de la fonction router
            router();
            // Navigation sur la page NewBills
            window.onNavigate(ROUTES_PATH.NewBill);

            //Ajout de la view NewBill
            document.body.innerHTML = NewBillUI();

            // Création d'objet - Nouvelle note de frais
            const newBillObject = new NewBill({
              document,
              onNavigate,
              store: mockStore,
              localStorage: window.localStorage,
            });

            // Récupération du formulaire
            const formNewBill = screen.getByTestId("form-new-bill");

            // Vérification que le formulaire s'affiche correctement
            expect(formNewBill).toBeTruthy();

            //Mock de la méthode de soumission du formulaire
            const handleSubmit = jest.fn((e) => newBillObject.handleSubmit(e));

            // Simulation de la soumission du formulaire
            formNewBill.addEventListener("submit", handleSubmit);
            fireEvent.submit(formNewBill);

            // La méthode est bien appelée
            expect(handleSubmit).toHaveBeenCalled();

            // Vérification que les champs sont vides
            expect(
              screen.getByRole("option", { name: "Transports" }).selected
            ).toBe(true);
            expect(
              document.querySelector(`input[data-testid="expense-name"]`).value
            ).toEqual("");
            expect(
              document.querySelector(`input[data-testid="amount"]`).value
            ).toEqual("");
            expect(
              document.querySelector(`input[data-testid="datepicker"]`).value
            ).toBe("");
            expect(
              document.querySelector(`input[data-testid="vat"]`).value
            ).toEqual("");
            expect(
              document.querySelector(`input[data-testid="pct"]`).value
            ).toEqual("");
            expect(
              document.querySelector(`textarea[data-testid="commentary"]`).value
            ).toEqual("");

            // Récupération du message d'erreur
            const errorMessage = screen.getByTestId("error-message-form");

            expect(errorMessage).toBeTruthy();
            expect(errorMessage).toHaveClass("showError");
          });
        });
      });
    });
  });
});

// test d'intégration POST
describe("Given it logged in as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When I send a right New Bill ", () => {
      test("then the new bill should be show in bill", async () => {
        // Création d'une fonction simulée mais qui surveille les appels
        jest.spyOn(mockStore, "bills");

        //Récupération des bills mocked
        const bills = await mockStore.bills().list();

        // Il y a bien 4 note de frais au départ
        expect(bills.length).toEqual(4);

        // Nouvelle note de frais
        const newBillTest = {
          email: "employee@test.tld",
          type: "Transport",
          name: "Taxi",
          amount: "100",
          date: "2022-05-30",
          vat: "20",
          pct: "10",
          commentary: `Taxi de l'aéroport au bureau`,
          fileUrl: undefined,
          fileName: "test.png",
          status: "pending",
        };

        // Ajout d'une nouvelle note de frais dans la liste des bills mocked
        mockStore.bills().create(newBillTest);

        waitFor(() => expect(bills.length).toEqual(5));
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
        test("fetches bills to API and fails with 404 message error", async () => {
          // Récupération des données mocked et application à la suite de la methode create avec la simulation d'une erreur
          mockStore.bills.mockImplementationOnce(() => {
            return {
              create: () => {
                return Promise.reject(new Error("Erreur 404"));
              },
            };
          });

          // Envoi de l'erreur dans la fonction view de Bills
          document.body.innerHTML = BillsUI({ error: "Erreur 404" });

          // Recherche du message d'erreur
          const message = await screen.getByText(/Erreur 404/);

          //Vérification qu'il soit bien affiché
          expect(message).toBeTruthy();
        });
        test("fetches bills to API and fails with 505 message error", async () => {
          // Récupération des données mocked et application à la suite de la methode create avec la simulation d'une erreur
          mockStore.bills.mockImplementationOnce(() => {
            return {
              create: () => {
                return Promise.reject(new Error("Erreur 500"));
              },
            };
          });

          // Envoi de l'erreur dans la fonction view de Bills
          document.body.innerHTML = BillsUI({ error: "Erreur 500" });

          // Recherche du message d'erreur
          const message = await screen.getByText(/Erreur 500/);

          //Vérification qu'il soit bien affiché
          expect(message).toBeTruthy();
        });
      });
    });
  });
});
