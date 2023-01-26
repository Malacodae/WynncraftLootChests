let loadCustomConfigLink;
let loadCustomConfigButton;
let customCollection;
let malaLink = 'https://raw.githubusercontent.com/Malacodae/WynncraftLootChests/main/malacodaeConfig.json';
let placesLink = 'https://raw.githubusercontent.com/Malacodae/WynncraftLootChests/main/wynncraftPlaces.json';

function wynError(message) {
    console.log(message);
    const error = document.getElementById('wynError');
    error.textContent = 'Oops! An error occurred: ' + message.toString();
    error.hidden = false;
    return;
}

async function fetchJson(link, isDouble) {
    if (isDouble) {
        const [response01, response02] = await Promise.all([
            fetch(link[0]),
            fetch(link[1])
        ]);
        if (!response01.ok || !response02.ok) { throw new Error(response01); }
        const promise01 = await response01.json();
        const promise02 = await response02.json();
        return [promise01, promise02];
    } else {
        const response = await fetch(link);
        if (!response.ok) { throw new Error(response); }
        const promise = await response.json();
        return promise;
    }
}

function loadCustomConfig() {
    loadCustomConfigButton.disabled = true;
    loadCustomConfigLink.disabled = true;
    loadCustomConfigButton.textContent = 'Reload to modify';
    document.getElementById('canUpdate').hidden = false;

    fetchJson(loadCustomConfigLink.value, false)
    .catch(error => wynError(error))
    .then(result => {
        let json = result;
        customCollection = new LootChestsCollection(json);
        customCollection.associateClosestLocation();
        customCollection.populateInfoBox('c-tot', 'c-t1', 'c-t2', 'c-t3', 'c-t4');
        customCollection.populateTable('customConfig');
        customCollection.populateNumericCompare(malaCollection);
    });
    return;
}

fetchJson([malaLink, placesLink], true)
.catch(error => wynError(error))
.then(result => init(result));

function init(result) {
    loadCustomConfigLink = document.getElementById('link');
    loadCustomConfigButton = document.getElementById('submit');

    wynncraftPlaces = new WynncraftPlaces(result[1]['labels']);
    malaCollection = new LootChestsCollection(result[0]);
    malaCollection.associateClosestLocation();
    malaCollection.populateInfoBox('m-tot', 'm-t1', 'm-t2', 'm-t3', 'm-t4');

    return;
}

function updateCollection() {
    if (!customCollection || !malaCollection) { return; }

    document.getElementById('update').disabled = true;
    document.getElementById('update').textContent = 'Downloaded';
    customCollection.enrichWith(malaCollection);
    customCollection.saveFile();

    return;
}
