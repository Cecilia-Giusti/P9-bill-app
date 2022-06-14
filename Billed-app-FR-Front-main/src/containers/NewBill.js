import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
    // Création du message d'erreur pour le formulaire
    const errorMessageForm = document.createElement("div");
    errorMessageForm.setAttribute("data-testid", "error-message-form");
    errorMessageForm.setAttribute("class", "errorMessageForm hiddenError");
    errorMessageForm.innerHTML = "Veuillez remplir tous les champs demandés";
    this.document.querySelector("#formNewBill").appendChild(errorMessageForm);

    // Création du message d'erreur pour les extensions de fichier
    const errorMessageExtension = document.createElement("div");
    errorMessageExtension.setAttribute(
      "data-testid",
      "error-message-extension"
    );
    errorMessageExtension.setAttribute(
      "class",
      "errorMessageExtension hiddenError"
    );
    errorMessageExtension.innerHTML =
      "Veuillez ajouter un fichier avec la bonne extension";
    this.document
      .querySelector(`input[data-testid="file"]`)
      .parentNode.appendChild(errorMessageExtension);
  }

  handleChangeFile = (e) => {
    e.preventDefault();
    const extendAccepted = new RegExp(".(jpg|jpeg|png)$");
    if (
      extendAccepted.test(
        this.document.querySelector(`input[data-testid="file"]`).files[0].name
      )
    ) {
      const errorMessageExtension = this.document.querySelector(
        ".errorMessageExtension"
      );
      errorMessageExtension.setAttribute(
        "class",
        "errorMessageExtension hiddenError"
      );
      const file = this.document.querySelector(`input[data-testid="file"]`)
        .files[0];
      const filePath = e.target.value.split(/\\/g);
      const fileName = filePath[filePath.length - 1];

      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append("file", file);
      formData.append("email", email);
      console.log("OK");

      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true,
          },
        })
        .then(({ fileUrl, key }) => {
          console.log(fileUrl);
          this.billId = key;
          this.fileUrl = fileUrl;
          this.fileName = fileName;
        })
        .catch((error) => console.error(error));
    } else {
      const errorMessageExtension = this.document.querySelector(
        ".errorMessageExtension"
      );
      errorMessageExtension.setAttribute(
        "class",
        "errorMessageExtension showError"
      );
      this.document.querySelector(`input[data-testid="file"]`).value = "";
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };

    if (
      !bill.name ||
      !bill.amount ||
      !bill.date ||
      !bill.pct ||
      !bill.fileName
    ) {
      const errorMessageForm = this.document.querySelector(".errorMessageForm");
      errorMessageForm.setAttribute("class", "errorMessageForm showError");
    } else {
      this.updateBill(bill);
      const errorMessageForm = this.document.querySelector(".errorMessageForm");
      errorMessageForm.setAttribute("class", "errorMessageForm hiddenError");
      this.onNavigate(ROUTES_PATH["Bills"]);
    }
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
