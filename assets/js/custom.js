// =========================================================
// LD12 – KOMPETENCIJŲ PAŽANGOS MODULIS
// Įgūdžių duomenų masyvas
// =========================================================

const competencySkills = [
    {
        name: "Elektros tinklų analizė",
        status: "planned",
        xp: 40
    },
    {
        name: "SolidWorks modeliavimas",
        status: "planned",
        xp: 40
    },
    {
        name: "AutoCAD projektavimas",
        status: "learning",
        xp: 40
    },
    {
        name: "MATLAB skaičiavimai",
        status: "learning",
        xp: 40
    },
    {
        name: "Elektros grandinių analizė",
        status: "completed",
        xp: 40
    },
    {
        name: "Techninių brėžinių skaitymas",
        status: "completed",
        xp: 40
    },
    {
        name: "KiCad projektavimas",
        status: "completed",
        xp: 40
    },
    {
        name: "Python programavimas",
        status: "completed",
        xp: 60
    }
];

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

    
    
    // =========================================================
    // LD12 – DINAMINIS ĮGŪDŽIŲ KORTELIŲ GENERAVIMAS
    // =========================================================

    // Įgūdžių stulpeliai
    const skillColumns = {
        planned: document.querySelector(".skill-column.planned"),
        learning: document.querySelector(".skill-column.learning"),
        completed: document.querySelector(".skill-column.completed")
    };

    // Būsenų pavadinimai
    const statusLabels = {
        planned: "Planuojama",
        learning: "Mokomasi",
        completed: "Atlikta"
    };


    // =========================================================
    // LD12 – DUOMENŲ SAUGOJIMAS LOCAL STORAGE
    // =========================================================

    const STORAGE_KEY = "competencySkillsStatus";


    // Išsaugo įgūdžių būsenas naršyklės vietinėje saugykloje
    function saveSkillStatuses() {

        const savedStatuses = competencySkills.map(function (skill) {
            return {
                name: skill.name,
                status: skill.status
            };
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStatuses));
    }


    // Įkelia anksčiau išsaugotas įgūdžių būsenas
    function loadSkillStatuses() {

        const savedData = localStorage.getItem(STORAGE_KEY);

        // Jei išsaugotų duomenų nėra, paliekamos pradinės būsenos
        if (!savedData) {
            return;
        }

        try {

            const savedStatuses = JSON.parse(savedData);

            if (!Array.isArray(savedStatuses)) {
                return;
            }

            competencySkills.forEach(function (skill) {

                const savedSkill = savedStatuses.find(function (item) {
                    return item && item.name === skill.name;
                });

                // Atkuriama tik galiojanti įgūdžio būsena
                if (
                    savedSkill &&
                    Object.prototype.hasOwnProperty.call(
                        statusLabels,
                        savedSkill.status
                    )
                ) {
                    skill.status = savedSkill.status;
                }
            });

        } catch (error) {
            console.error("Nepavyko įkelti įgūdžių būsenų:", error);
        }
    }


    // 1. Sukuria vieną įgūdžio kortelę
    function createSkillCard(skill) {

        const card = document.createElement("div");
        card.className = "skill-card";

        const title = document.createElement("h4");
        title.textContent = skill.name;

        const info = document.createElement("div");
        info.className = "skill-card-info";

        const status = document.createElement("span");
        status.textContent = "Būsena: " + statusLabels[skill.status];

        const xp = document.createElement("strong");
        xp.textContent = "XP: " + skill.xp;

        // Būsenos pasirinkimas
        const select = document.createElement("select");
        select.className = "skill-status-select";
        select.setAttribute("aria-label", "Keisti įgūdžio būseną");

        Object.entries(statusLabels).forEach(function ([value, label]) {

            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;

            if (skill.status === value) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        
        select.addEventListener("change", function () {

            skill.status = select.value;

            saveSkillStatuses();

            renderSkills();
            updateXPInfo();
            updateSkillsStatistics();
        });


        info.append(status, xp);
        card.append(title, info, select);

        return card;
    }


    // 2. Dinamiškai sugeneruoja visas įgūdžių korteles
    function renderSkills() {

        // Pašalinamos senos kortelės
        Object.values(skillColumns).forEach(function (column) {

            column.querySelectorAll(".skill-card").forEach(function (card) {
                card.remove();
            });
        });

        // Kortelės priskiriamos atitinkamiems stulpeliams
        competencySkills.forEach(function (skill) {

            const card = createSkillCard(skill);

            skillColumns[skill.status].appendChild(card);
        });
    }


    // 3. Apskaičiuoja XP, lygį, rangą ir progreso juostą
    function updateXPInfo() {

        // Skaičiuojami tik atliktų įgūdžių XP
        const totalXP = competencySkills.reduce(function (sum, skill) {

            if (skill.status === "completed") {
                return sum + skill.xp;
            }

            return sum;
        }, 0);

        let level;
        let rank;
        let progress;

        // Nustatomas lygis, rangas ir progresas
        if (totalXP < 50) {

            level = 1;
            rank = "Pradedantysis";
            progress = (totalXP / 50) * 100;

        } else if (totalXP < 150) {

            level = 2;
            rank = "Praktikantas";
            progress = ((totalXP - 50) / 100) * 100;

        } else if (totalXP < 300) {

            level = 3;
            rank = "Specialistas";
            progress = ((totalXP - 150) / 150) * 100;

        } else {

            level = 4;
            rank = "Profesionalas";
            progress = 100;
        }

        // Atnaujinami modulio elementai
        document.getElementById("total-xp").textContent = totalXP + " XP";

        document.getElementById("current-level").textContent = level;

        document.getElementById("current-rank").textContent = rank;

        document.getElementById("xp-progress-percent").textContent =
            Math.round(progress) + "%";

        document.getElementById("xp-progress-fill").style.width =
            progress + "%";
    }


    // 4. Atnaujina įgūdžių statistiką
    function updateSkillsStatistics() {

        const totalSkills = competencySkills.length;

        const completedSkills = competencySkills.filter(function (skill) {
            return skill.status === "completed";
        }).length;

        const completedPercent = totalSkills === 0
            ? 0
            : Math.round((completedSkills / totalSkills) * 100);

        document.getElementById("skills-total-count").textContent =
            totalSkills;

        document.getElementById("skills-completed-count").textContent =
            completedSkills;

        document.getElementById("skills-completed-percent").textContent =
            completedPercent + "%";
    }


    // Pradinis modulio duomenų įkėlimas
    loadSkillStatuses();

    // Pradinis modulio atvaizdavimas ir duomenų apskaičiavimas
    renderSkills();
    updateXPInfo();
    updateSkillsStatistics();


});

