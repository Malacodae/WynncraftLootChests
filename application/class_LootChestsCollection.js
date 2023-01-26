class LootChestsCollection {
    constructor(input) {
        this.input = input;
        this.T1_counter = 0;
        this.T2_counter = 0;
        this.T3_counter = 0;
        this.T4_counter = 0;
        this.lootChests = [];
        this.otherWaypoint = [];
        this.time = Math.floor(Date.now() / 1000);
        this.customPois = this.input['mapFeature.customPois'];

        for (let i = 0; i < this.customPois.length; i++) {
            switch (this.customPois[i]['name']) {
                case 'Loot Chest 1':
                    this.T1_counter++;
                    this.addLootChest(this.customPois[i]);
                    break;
                case 'Loot Chest 2':
                    this.T2_counter++;
                    this.addLootChest(this.customPois[i]);
                    break;
                case 'Loot Chest 3':
                    this.T3_counter++;
                    this.addLootChest(this.customPois[i]);
                    break;
                case 'Loot Chest 4':
                    this.T4_counter++;
                    this.addLootChest(this.customPois[i]);
                    break;
                default:
                    this.otherWaypoint.push(this.customPois[i]);
                    break;
            }
        }
    }

    addLootChest(chest) {
        if (typeof chest['malacodae'] == 'undefined') { chest['malacodae'] = []; }
        chest['malacodae']['lastCheck'] = this.time;
        this.lootChests.push(chest);
        return;
    }

    associateClosestLocation() {
        for (let i = 0; i < this.lootChests.length; i++) {
            let chest = this.lootChests[i];
            if (typeof chest['malacodae'] == 'undefined') { chest['malacodae'] = []; }
            chest['malacodae']['closestTo'] = wynncraftPlaces.checkClosestPlace(chest['location']);
        }
        return;
    }

    enrichWith(comparison) {
        for (let i = 0; i < comparison.lootChests.length; i++) {
            let comp = comparison.lootChests[i]['location'];
            let isNew = true;

            for (let j = 0; j < this.lootChests.length; j++) {
                let mala = this.lootChests[j]['location'];

                if (mala['x'] === comp['x'] &&
                    mala['y'] === comp['y'] &&
                    mala['z'] === comp['z']
                ) {
                    isNew = false;
                    break;
                }
            }
            if (isNew) { this.lootChests.push(comparison.lootChests[i]); }
        }
        return;
    }

    populateTable(htmlelement) {
        let container = document.getElementById(htmlelement);
        container.replaceChildren();
        for (let i = 0; i < this.lootChests.length; i++) {
            let l = this.lootChests[i];
            let tr = document.createElement('tr');
            let index = document.createElement('th');
            let tier = document.createElement('td');
            let location = document.createElement('td');
            let closestTo = document.createElement('td');

            index.textContent = i+1;
            tier.textContent = l['name'];
            location.textContent = l['location']['x'] + ', ' + l['location']['y'] + ', ' + l['location']['z'];

            if (l['malacodae'] && l['malacodae']['closestTo']) {
                closestTo.textContent = l['malacodae']['closestTo']['place']['name'] + ' (LVL ' + l['malacodae']['closestTo']['place']['level'] + ')';
            } else {
                closestTo.textContent = 'ND';
            }

            tr.appendChild(index);
            tr.appendChild(tier);
            tr.appendChild(location);
            tr.appendChild(closestTo);
            container.appendChild(tr);
        }
        return;
    }

    populateInfoBox(itot, it1, it2, it3, it4) {
        const tot = document.getElementById(itot);
        const t1 = document.getElementById(it1);
        const t2 = document.getElementById(it2);
        const t3 = document.getElementById(it3);
        const t4 = document.getElementById(it4);
        tot.textContent = this.lootChests.length;
        t1.textContent = this.T1_counter;
        t2.textContent = this.T2_counter;
        t3.textContent = this.T3_counter;
        t4.textContent = this.T4_counter;
        return;
    }

    populateNumericCompare(collection) {
        const dtot = document.getElementById('diftot');
        const d1 = document.getElementById('dif1');
        const d2 = document.getElementById('dif2');
        const d3 = document.getElementById('dif3');
        const d4 = document.getElementById('dif4');
        dtot.textContent = this.lootChests.length - collection.lootChests.length;
        d1.textContent = this.T1_counter - collection.T1_counter;
        d2.textContent = this.T2_counter - collection.T2_counter;
        d3.textContent = this.T3_counter - collection.T3_counter;
        d4.textContent = this.T4_counter - collection.T4_counter;
        return;
    }

    mergedWaypoints() {
        let output = this.lootChests;
        for (let i = 0; i < this.otherWaypoint.length; i++) {
            output.push(this.otherWaypoint[i]);
        }
        return output;
    }

    saveFile() {
        this.input['mapFeature.customPois'] = this.mergedWaypoints();

        let dataStr = JSON.stringify(this.input);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        let exportFileDefaultName = 'RENAME_ME.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        return;
    }
}
