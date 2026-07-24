function getTimePartsFromPickable(timePickable /* time-pickable element */) {
    const pattern = /^(\d+):(\d+)$/;
    const [value, hours, minutes] = Array.from(timePickable.value.match(pattern));
    return {
        value,
        hours,
        minutes
    };
};

function getSelectsFromPicker(timePicker /* time-picker element */) {
    const [hours, minutes] = timePicker.querySelectorAll(".time-picker_select");
    return {
        hours,
        minutes
    };
}

function getTimeStringFromPicker(timePicker /* time-picker element */) {
    const selects = getSelectsFromPicker(timePicker);
    return `${selects.hours.value}:${selects.minutes.value}`;
}

function numberToOption(number) {
    const padded = number.toString().padStart(2, "0");
    return `<option value="${padded}">${padded}</option>`;
}

function buildPicker(timePickable /* time-pickable element */) {
    const picker = document.createElement("div");
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(numberToOption);
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(numberToOption);
    picker.classList.add("time-picker");
    picker.innerHTML = `
        <select class="time-picker_select">
            ${hours.join("")}
        </select>
        :
        <select class="time-picker_select">
            ${minutes.join("")}
        </select>
    `;

    const selects = getSelectsFromPicker(picker);
    if (timePickable.value) {
        const { hours, minutes } = getTimePartsFromPickable(timePickable);
        selects.hours.value = hours;
        selects.minutes.value = minutes;
    }

    selects.hours.addEventListener("change", () => { timePickable.value = getTimeStringFromPicker(picker); });
    selects.minutes.addEventListener("change", () => { timePickable.value = getTimeStringFromPicker(picker); });

    return picker;
}

function show(timePickable /* time-pickable element */) {
    const picker = buildPicker(timePickable);
    const { bottom: top, left } = timePickable.getBoundingClientRect();
    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;
    document.body.appendChild(picker);
    return picker;
}

export function activate() {
    document.head.insertAdjacentHTML("beforeend", `
        <style>
            .time-picker {
                position: absolute;
                display: inline-block;
                padding: 10px;
                background-color: gray;
                border-radius: 6px;
            }

            .time-picker_select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                text-align: center;
                border: 1px solid lightgray;
                padding: 3px 5px;
                border-radius: 6px;
                background-color: whitesmoke;
                cursor: pointer;
                font-family: 'Heebo', sans-serif;
            }
        </style>
    `);

    document.querySelectorAll(".time-pickable").forEach(timePickable => {
        let activePicker = null;

        timePickable.addEventListener("focus", () => {
            if (activePicker) {
                return;
            }
            activePicker = show(timePickable);

            const onClickAway = ({target}) => {
                // console.log("---> onClickAway()", target);
                if (target === activePicker || target === timePickable || activePicker.contains(target)) {
                    return;
                }
                document.removeEventListener("mousedown", onClickAway);
                document.body.removeChild(activePicker);
                activePicker = null;
            };

            document.addEventListener("mousedown", onClickAway);
        });
    });
}

// const exampleTimePickable = document.querySelector(".time-pickable");
// console.log(getTimePartsFromPickable(exampleTimePickable));
// const exampleTimePicker = document.querySelector(".time-picker");
// console.log(getSelectsFromPicker(exampleTimePicker));
// console.log(getTimeStringFromPicker(exampleTimePicker));
// console.log("5 -> " + numberToOption(5));
// console.log("10 -> " + numberToOption(10));
// console.log(buildPicker(exampleTimePickable));
// document.body.appendChild(buildPicker(exampleTimePickable));
// document.body.appendChild(show(exampleTimePickable));
// activate();

