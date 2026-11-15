

document.addEventListener("DOMContentLoaded", () => {

    let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    let fuelRecords = JSON.parse(localStorage.getItem("fuelRecords")) || [];

    const vehicleForm = document.getElementById("vehicleForm");
    const driverForm = document.getElementById("driverForm");
    const fuelForm = document.getElementById("fuelForm");

    function saveData() {
        localStorage.setItem("vehicles", JSON.stringify(vehicles));
        localStorage.setItem("drivers", JSON.stringify(drivers));
        localStorage.setItem("fuelRecords", JSON.stringify(fuelRecords));
    }

    function updateDashboard() {
        const totalVehicles = document.getElementById("totalVehicles");
        const activeVehicles = document.getElementById("activeVehicles");
        const totalDrivers = document.getElementById("totalDrivers");
        const totalFuel = document.getElementById("totalFuel");
        const totalFuelCost = document.getElementById("totalFuelCost");

        if (totalVehicles) {
            totalVehicles.textContent = vehicles.length;
        }

        if (activeVehicles) {
            activeVehicles.textContent = vehicles.filter(
                vehicle => vehicle.status.toLowerCase() === "active"
            ).length;
        }

        if (totalDrivers) {
            totalDrivers.textContent = drivers.length;
        }

        if (totalFuel) {
            totalFuel.textContent = fuelRecords.reduce(
                (sum, record) => sum + Number(record.quantity), 0
            ).toFixed(2) + " L";
        }

        if (totalFuelCost) {
            totalFuelCost.textContent = "₹" + fuelRecords.reduce(
                (sum, record) => sum + Number(record.cost), 0
            ).toFixed(2);
        }
    }
    function populateFuelVehicleOptions() {
    const dropdown = document.getElementById("fuelVehicle");

    if (!dropdown) return;

    const selectedVehicle = dropdown.value;

    dropdown.innerHTML = '<option value="">Select Vehicle</option>';

    vehicles.forEach(vehicle => {
        const option = document.createElement("option");

        option.value = vehicle.number;
        option.textContent = vehicle.name + " - " + vehicle.number;

        dropdown.appendChild(option);
    });

    dropdown.value = selectedVehicle;
}

    function displayVehicles() {
        const table = document.getElementById("vehicleTableBody");
        if (!table) return;

        table.innerHTML = "";

        vehicles.forEach((vehicle, index) => {
            const row = document.createElement("tr");

            [vehicle.name, vehicle.number, vehicle.type, vehicle.status]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";

            editButton.addEventListener("click", () => {
                const name = prompt("Vehicle name:", vehicle.name);
                if (name === null) return;

                const number = prompt("Vehicle number:", vehicle.number);
                if (number === null) return;

                const type = prompt("Vehicle type:", vehicle.type);
                if (type === null) return;

                const status = prompt("Status (Active/Inactive):", vehicle.status);
                if (status === null) return;

                if (![name, number, type, status].every(value => value.trim())) {
                    alert("All fields are required!");
                    return;
                }

                if (vehicles.some((v, i) => i !== index &&
                    v.number.toLowerCase() === number.trim().toLowerCase())) {
                    alert("Vehicle number already exists!");
                    return;
                }

                Object.assign(vehicle, {
                    name: name.trim(),
                    number: number.trim(),
                    type: type.trim(),
                    status: status.trim()
                });

                saveData();
                displayVehicles();
                updateDashboard();
                alert("Vehicle updated successfully!");
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                if (!confirm("Delete this vehicle?")) return;

                vehicles.splice(index, 1);
                saveData();
                displayVehicles();
                updateDashboard();
            });

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);
            table.appendChild(row);
        });
        populateFuelVehicleOptions();
    }

    function displayDrivers() {
        const table = document.getElementById("driverTableBody");
        if (!table) return;

        table.innerHTML = "";

        drivers.forEach((driver, index) => {
            const row = document.createElement("tr");

            [driver.name, driver.license, driver.phone]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";

            editButton.addEventListener("click", () => {
                const name = prompt("Driver name:", driver.name);
                if (name === null) return;

                const license = prompt("License number:", driver.license);
                if (license === null) return;

                const phone = prompt("Phone number:", driver.phone);
                if (phone === null) return;

                if (![name, license, phone].every(value => value.trim())) {
                    alert("All fields are required!");
                    return;
                }

                Object.assign(driver, {
                    name: name.trim(),
                    license: license.trim(),
                    phone: phone.trim()
                });

                saveData();
                displayDrivers();
                alert("Driver updated successfully!");
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                if (!confirm("Delete this driver?")) return;

                drivers.splice(index, 1);
                saveData();
                displayDrivers();
                updateDashboard();
            });

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);
            table.appendChild(row);
        });
    }

    function displayFuelRecords() {
        const table = document.getElementById("fuelTableBody");
        if (!table) return;

        table.innerHTML = "";

        fuelRecords.forEach((record, index) => {
            const row = document.createElement("tr");

            [record.vehicle, record.quantity + " L",
             "₹" + Number(record.cost).toFixed(2), record.date]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                if (!confirm("Delete this fuel record?")) return;

                fuelRecords.splice(index, 1);
                saveData();
                displayFuelRecords();
                updateDashboard();
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            table.appendChild(row);
        });
    }

    if (vehicleForm) {
        vehicleForm.addEventListener("submit", event => {
            event.preventDefault();

            const vehicle = {
                name: document.getElementById("vehicleName").value.trim(),
                number: document.getElementById("vehicleNumber").value.trim(),
                type: document.getElementById("vehicleType").value,
                status: document.getElementById("vehicleStatus").value
            };

            if (!vehicle.name || !vehicle.number ||
                !vehicle.type || !vehicle.status) {
                alert("Please fill all vehicle details!");
                return;
            }

            if (vehicles.some(v =>
                v.number.toLowerCase() === vehicle.number.toLowerCase())) {
                alert("Vehicle number already exists!");
                return;
            }

            vehicles.push(vehicle);
            saveData();
            displayVehicles();
            updateDashboard();
            vehicleForm.reset();

            alert("Vehicle added successfully!");
        });
    }

    if (driverForm) {
        driverForm.addEventListener("submit", event => {
            event.preventDefault();

            const driver = {
                name: document.getElementById("driverName").value.trim(),
                license: document.getElementById("driverLicense").value.trim(),
                phone: document.getElementById("driverPhone").value.trim()
            };

            if (!driver.name || !driver.license || !driver.phone) {
                alert("Please fill all driver details!");
                return;
            }

            drivers.push(driver);
            saveData();
            displayDrivers();
            updateDashboard();
            driverForm.reset();

            alert("Driver added successfully!");
        });
    }

    if (fuelForm) {
        fuelForm.addEventListener("submit", event => {
            event.preventDefault();

            const fuel = {
                vehicle: document.getElementById("fuelVehicle").value,
                quantity: Number(document.getElementById("fuelQuantity").value),
                cost: Number(document.getElementById("fuelCost").value),
                date: document.getElementById("fuelDate").value
            };

            if (!fuel.vehicle || !fuel.date ||
                !Number.isFinite(fuel.quantity) || fuel.quantity <= 0 ||
                !Number.isFinite(fuel.cost) || fuel.cost <= 0) {
                alert("Please enter valid fuel details!");
                return;
            }

            fuelRecords.push(fuel);
            saveData();
            displayFuelRecords();
            updateDashboard();
            fuelForm.reset();

            alert("Fuel record added successfully!");
        });
    }

    const vehicleSearch = document.getElementById("vehicleSearch");

    if (vehicleSearch) {
        vehicleSearch.addEventListener("input", () => {
            const searchValue = vehicleSearch.value.toLowerCase();

            document.querySelectorAll("#vehicleTableBody tr")
                .forEach(row => {
                    row.style.display = row.textContent
                        .toLowerCase()
                        .includes(searchValue) ? "" : "none";
                });
        });
    }

const navLinks = document.querySelectorAll(".navigation a");
const sections = document.querySelectorAll("#dashboard, .content-section");

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.toggle("active", section.id === sectionId);
    });

    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + sectionId);
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const sectionId = link.getAttribute("href").substring(1);
        showSection(sectionId);
        history.replaceState(null, "", "#" + sectionId);
    });
});

const initialSection = window.location.hash.substring(1);
const validSection = Array.from(sections).some(section => section.id === initialSection);

showSection(validSection ? initialSection : "dashboard");


    displayVehicles();
    displayDrivers();
    displayFuelRecords();
    updateDashboard();

});
