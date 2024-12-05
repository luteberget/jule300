
const activityTypes = [["👟", 1.0], ["🚲", 2.0], ["🏊", 0.25]];

function maketable() {
    const inputs = [];
    const luker = [];

    // Header
    const table = document.createElement("table");
    const header = table.createTHead().insertRow();
    header.insertCell();
    for(const [name,_factor] of activityTypes) {
        header.insertCell().innerHTML = name;
    }
    header.insertCell().innerHTML = "Luker";

    for (i = 1; i <= 24; i++) {
        const row = table.insertRow();
        const rowInputs = [];
        row.insertCell().innerHTML = `${i}. des.`;
        for(const [name,_factor] of activityTypes) {
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.max = "100";
            input.step = 1;
            row.insertCell().appendChild(input);
            rowInputs.push(input);
        }
        luker.push(row.insertCell());
        inputs.push(rowInputs);
    }

    document.body.appendChild(table);
    
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Fordel luker"
    document.body.appendChild(button);

    const result = document.createElement("div");
    document.body.appendChild(result);

    button.onclick = (_) => {

        for(const rowInputs of inputs) {
            for(var i = 0; i < rowInputs.length; i++) {
                const factor = activityTypes[i][1];
                const value = Number(rowInputs[i].value);
                const equivalentValue = Math.floor( value / factor + 0.01 );
                console.log("ROW ", i, equivalentValue);
            }
        }

        // compute luker here

        for(const luke of luker) {
            luke.innerHTML = '';
            for(const [l] of [[1],[2]]) {
                luke.innerHTML += `<span>${l}</span>`;
            }
        }
        result.innerHTML = "ingen poeng";
    };
}

maketable();
