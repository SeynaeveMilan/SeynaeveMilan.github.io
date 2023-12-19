const $toggleEl = document.querySelector(`.js-theme-toggle`);
const accelerationMeter1 = document.querySelector('.comparison-chart .meter1');
const accelerationMeter2 = document.querySelector('.comparison-chart .meter2');
const rangeMeter1 = document.querySelector('.comparison-chart .meter3');
const rangeMeter2 = document.querySelector('.comparison-chart .meter4');

// Define labels for each feature
const featureLabels = {
    acceleration: 'Acceleration',
    range: 'Range',
    // Add labels for other features as needed
};

const updateFeatures = (selectedModel, accelerationMeter, rangeMeter) => {
    const selectedCar = findCarByModel(selectedModel);

    if (selectedCar) {
        // Update Acceleration
        if (selectedCar.acceleration) {
            accelerationMeter.value = selectedCar.acceleration;
            accelerationMeter.nextElementSibling.textContent = selectedCar.acceleration.toFixed(1);
        } else {
            accelerationMeter.value = 5;
            accelerationMeter.nextElementSibling.textContent = '5.0';
        }

        // Update Range
        if (selectedCar.range) {
            rangeMeter.value = selectedCar.range;
            rangeMeter.nextElementSibling.textContent = selectedCar.range;
        } else {
            rangeMeter.value = 700; // Default range value
            rangeMeter.nextElementSibling.textContent = '700';
        }
    }
};



const updateCarImage = (selectedModel, carImageElement) => {
    const selectedCar = findCarByModel(selectedModel);

    if (selectedCar && selectedCar.img) {
        carImageElement.src = selectedCar.img;
    } else {
        carImageElement.src = 'path/to/default-image.png';
    }
};
const showOptions = () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const carDropdown1 = document.getElementById('cars1');
            const carDropdown2 = document.getElementById('cars2');
            const carimg1 = document.getElementById('js-img1');
            const carimg2 = document.getElementById('js-img2');




            const populateDropdowns = (data, carDropdown) => {
                for (const brand in data) {
                    const models = data[brand];

                    const groupOption = document.createElement('optgroup');
                    groupOption.label = brand;

                    models.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.model;
                        option.text = model.model;
                        groupOption.appendChild(option);
                    });

                    carDropdown.appendChild(groupOption);
                }
            };

            const findCarByModel = (model, data) => {
                for (const brand in data) {
                    const cars = data[brand];
                    const selectedCar = cars.find(car => car.model === model);
                    if (selectedCar) {
                        return selectedCar;
                    }
                }
                return null;
            };

            const updateCarInfo = (selectedModel, carImageElement, accelerationMeter, rangeMeter) => {
                const selectedCar = findCarByModel(selectedModel, data);
            
                if (selectedCar) {
                    carImageElement.src = selectedCar.img || 'path/to/default-image.png';
                    accelerationMeter.value = selectedCar.acceleration || 5;
                    accelerationMeter.nextElementSibling.textContent = (selectedCar.acceleration || 5).toFixed(1);
            
                    // Update Range
                    if (selectedCar.range) {
                        rangeMeter.value = selectedCar.range;
                        rangeMeter.nextElementSibling.textContent = selectedCar.range;
                    } else {
                        rangeMeter.value = 1000; // Default range value
                        rangeMeter.nextElementSibling.textContent = '1000';
                    }
                }
            };

            const handleDropdownChange = (selectedModel, carImageElement, accelerationMeter, rangeMeter) => {
                updateCarInfo(selectedModel, carImageElement, accelerationMeter, rangeMeter);
            };
            
            carDropdown1.addEventListener('change', () => {
                handleDropdownChange(carDropdown1.value, carimg1, accelerationMeter1, rangeMeter1);
            });
            
            carDropdown2.addEventListener('change', () => {
                handleDropdownChange(carDropdown2.value, carimg2, accelerationMeter2, rangeMeter2);
            });
            
            

            populateDropdowns(data, carDropdown1);
            populateDropdowns(data, carDropdown2);

            handleDropdownChange(carDropdown1.value, carimg1, accelerationMeter1, rangeMeter1);
            handleDropdownChange(carDropdown2.value, carimg2, accelerationMeter2, rangeMeter2);

        })
        .catch(error => console.error('Error fetching data:', error));
};


//* theme toggle */

const storageKey = 'theme-preference'

const changeThemePreference = () => {
    // flip current value
    theme.value = theme.value === 'light'
        ? 'dark'
        : 'light'

    setThemePreference()
}

const getThemePreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey)
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
}

const setThemePreference = () => {
    localStorage.setItem(storageKey, theme.value)
    reflectThemePreference()
}

const reflectThemePreference = () => {
    document.firstElementChild
        .setAttribute('data-theme', theme.value)

    document
        .querySelector('#theme-toggle')
        ?.setAttribute('aria-label', theme.value)
}

const theme = {
    value: getThemePreference(),
}

// set early so no page flashes / CSS is made aware
reflectThemePreference()

window.onload = () => {
    // set on load so screen readers can see latest value on the button
    reflectThemePreference()

    // now this script can find and listen for clicks on the control
    document
        .querySelector('.js-theme-toggle')
        .addEventListener('click', changeThemePreference)
}
const init = () => {
    const accelerationMeter1 = document.querySelector('.comparison-chart .meter1');
    const accelerationMeter2 = document.querySelector('.comparison-chart .meter2');
    const rangeMeter = document.querySelector('.comparison-chart .meter4');
    showOptions();
};


document.addEventListener("DOMContentLoaded", init);
window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light'
        setThemePreference()
    })