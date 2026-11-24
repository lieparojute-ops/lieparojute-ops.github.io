document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const clearBtn = document.getElementById("clear-btn");

    const results = document.getElementById("form-results");
    const resultDetails = document.getElementById("result-details");
    const ratingAverage = document.getElementById("rating-average");

    const fields = form.querySelectorAll("[data-field]");
    const touchedFields = new Set();

    // Vertinimo slankikliai
    const ratingIds = ["rating1", "rating2", "rating3"];

    // Atnaujina šalia slankiklio rodomą reikšmę
    function updateRatingValue(id) {
        const slider = document.getElementById(id);
        const output = document.getElementById(id + "-value");

        output.textContent = slider.value;
    }

    ratingIds.forEach(function (id) {
        const slider = document.getElementById(id);

        updateRatingValue(id);

        slider.addEventListener("input", function () {
            updateRatingValue(id);
            validateForm();
        });
    });


    // Formos laukų validavimas
    function validateField(field) {

        const value = field.value.trim();
        let error = "";

        switch (field.id) {

            case "firstName":
            case "lastName":
                if (value === "") {
                    error = "Šis laukas privalomas.";
                } else if (!/^\p{L}+$/u.test(value)) {
                    error = "Įveskite tik raides.";
                }
                break;

            case "email":
                if (value === "") {
                    error = "Įveskite el. pašto adresą.";
                } else if (!field.checkValidity()) {
                    error = "Įveskite taisyklingą el. pašto adresą.";
                }
                break;

            case "phone": {
                const digits = value.replace(/\D/g, "");

                if (value === "") {
                    error = "Įveskite telefono numerį.";
                } else if (digits.length !== 11 || !digits.startsWith("3706")) {
                    error = "Įveskite numerį formatu +370 6xx xxxxx.";
                }

                break;
            }

            case "address":
                if (value === "") {
                    error = "Įveskite adresą.";
                }
                break;

            case "rating1":
            case "rating2":
            case "rating3":
                if (value === "" || Number(value) < 1 || Number(value) > 10) {
                    error = "Pasirinkite įvertinimą nuo 1 iki 10.";
                }
                break;
        }

        const errorElement = document.getElementById(field.id + "-error");

        if (errorElement) {
            errorElement.textContent = touchedFields.has(field.id) ? error : "";
        }

        field.classList.toggle("is-invalid", touchedFields.has(field.id) && error !== "");

        return error === "";
    }


    // Patikrina visus laukus ir valdo Siųsti mygtuką
    function validateForm() {

        let isFormValid = true;

        fields.forEach(function (field) {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        submitBtn.disabled = !isFormValid;
    }

    // Telefono numerio formatavimas realiuoju laiku
    const phoneField = document.getElementById("phone");

    phoneField.addEventListener("input", function () {

        // Paliekami tik skaitmenys
        let digits = this.value.replace(/\D/g, "");

        // Pašalinamas Lietuvos šalies kodas arba pradinis 8 / 0
        if (digits.startsWith("370")) {
            digits = digits.slice(3);
        } else if (digits.startsWith("8") || digits.startsWith("0")) {
            digits = digits.slice(1);
        }

        // Leidžiami ne daugiau kaip 8 nacionalinio numerio skaitmenys
        digits = digits.slice(0, 8);

        // Formuojamas telefono numeris
        if (digits.length === 0) {
            this.value = "";
        } else {
            this.value = "+370 " + digits.slice(0, 3);

            if (digits.length > 3) {
                this.value += " " + digits.slice(3);
            }
        }
    });

    
    // Tikrina laukus įvedant duomenis
    fields.forEach(function (field) {

        field.addEventListener("input", function () {
            touchedFields.add(field.id);
            validateForm();
        });

        field.addEventListener("blur", function () {
            touchedFields.add(field.id);
            validateForm();
        });

    });


    // Formos pateikimas
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        fields.forEach(function (field) {
            touchedFields.add(field.id);
        });

        validateForm();

        if (submitBtn.disabled) {
            return;
        }

        // Surenkami formos duomenys į JavaScript objektą
        const formData = {
            vardas: document.getElementById("firstName").value.trim(),
            pavarde: document.getElementById("lastName").value.trim(),
            elPastas: document.getElementById("email").value.trim(),
            telefonoNumeris: document.getElementById("phone").value.trim(),
            adresas: document.getElementById("address").value.trim(),
            zinute: document.getElementById("message").value.trim(),
            dizainoVertinimas: Number(document.getElementById("rating1").value),
            turinioVertinimas: Number(document.getElementById("rating2").value),
            patogumoVertinimas: Number(document.getElementById("rating3").value)
        };

        // Objektas išvedamas į naršyklės konsolę
        console.log("Formos duomenys:", formData);

        // Duomenys atvaizduojami po forma
        resultDetails.replaceChildren();

        const labels = {
            vardas: "Vardas",
            pavarde: "Pavardė",
            elPastas: "El. paštas",
            telefonoNumeris: "Tel. numeris",
            adresas: "Adresas",
            zinute: "Žinutė",
            dizainoVertinimas: "Svetainės dizaino vertinimas",
            turinioVertinimas: "Svetainės turinio vertinimas",
            patogumoVertinimas: "Svetainės patogumo vertinimas"
        };

        Object.entries(formData).forEach(function ([key, value]) {

            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = labels[key] + ": ";
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(value));

            resultDetails.appendChild(paragraph);
        });

        // Apskaičiuojamas trijų įvertinimų vidurkis
        const average = (
            formData.dizainoVertinimas +
            formData.turinioVertinimas +
            formData.patogumoVertinimas
        ) / 3;

        ratingAverage.textContent =
            formData.vardas + " " + formData.pavarde +
            ": " + average.toFixed(2);

        results.hidden = false;
    });


    // Formos išvalymas
    clearBtn.addEventListener("click", function () {

        form.reset();

        touchedFields.clear();

        fields.forEach(function (field) {
            field.classList.remove("is-invalid");

            const errorElement = document.getElementById(field.id + "-error");

            if (errorElement) {
                errorElement.textContent = "";
            }
        });

        ratingIds.forEach(function (id) {
            updateRatingValue(id);
        });

        results.hidden = true;
        resultDetails.replaceChildren();
        ratingAverage.textContent = "";

        validateForm();
    });

});