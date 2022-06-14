/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { when } from "jquery";

jest.mock("../app/store", () => mockStore);

describe("Given it logged in as an employee", () => {
  describe("When I am on NewBill Page", () => {
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

      describe("When I upload a file with a bad extension", () => {
        test("Then an error message should be show in the console", () => {
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

          // Le message d'erreur dans la console s'affiche
          expect(handleChangeFile).toThrowErrorMatchingSnapshot();
        });
      });

      describe("When, I click on submit", () => {
        describe("When submit should be send", () => {
          test("Then the form should be completed correctly ", () => {
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

            // La méthode est bien appelée
            expect(handleSubmit).toHaveBeenCalled();
            expect(updateBill).toHaveBeenCalled();
            expect(updateBill).toBeCalledWith(newBillTest);
          });

          describe("when the form is empty", () => {
            test("then the form should not be send", () => {
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
              const handleSubmit = jest.fn((e) =>
                newBillObject.handleSubmit(e)
              );

              // Simulation de la soumission du formulaire
              formNewBill.addEventListener("submit", handleSubmit);
              fireEvent.submit(formNewBill);

              // La méthode est bien appelée
              expect(handleSubmit).toHaveBeenCalled();

              // Vérification que les champs sont correctement rempli
              expect(
                screen.getByRole("option", { name: "Transports" }).selected
              ).toBe(true);
              expect(
                document.querySelector(`input[data-testid="expense-name"]`)
                  .value
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
                document.querySelector(`textarea[data-testid="commentary"]`)
                  .value
              ).toEqual("");
            });
          });
        });
      });
    });
  });
});
