
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
        let input_str = "";
        for(var i = 0; i < inputs.length; i++) {
            for(var j = 0; j < activityTypes.length; j++) {
                const factor = activityTypes[i][1];
                const value = Number(rowInputs[i].value);
                const equivalentValue = Math.floor( value / factor + 0.01 );
                input_str += `${i};${j};${equivalentValue}\n`;
            }
        }
        input_str = input_str.substring(0, input_str.length-1);

        // compute luker here

        output_str = "";


        // Remove old luker

        for(const luke of luker) {
            luke.innerHTML = '';
            for(const [l] of [[1],[2]]) {
                luke.innerHTML += `<span>${l}</span>`;
            }
        }

        let num_luker = 0;
        let num_poeng = 0;
        for(const line of output_str.split("\n")) {
            const fields = output_str.split(";");
            const day = Number(fields[0]);
            const activity_type = Number(fields[1]);
            const luke = Number(fields[2]);
            luker[day].innerHTML += `<span>act${activityTypes} ${luke}</span>`;
            num_luker += 1;
            num_poeng += luke;
        }

        result.innerHTML = `<strong>${num_poeng}</strong> poeng på ${num_luker} luker!`
    };
}

maketable();
