class WynncraftPlaces {
    constructor(input) {
        this.places = input;
        return;
    }

    checkClosestPlace(chest) {
        let currentClosest = {};
        for (let i = 0; i < this.places.length; i++) {
            let loc = this.places[i];
            let distance = Math.sqrt(
                Math.pow((loc['x'] - chest['x']), 2) +
                Math.pow((loc['z'] - chest['z']), 2)
            )

            if (JSON.stringify(currentClosest) === '{}' || currentClosest['distance'] > distance) {
                currentClosest = {
                    distance: Math.floor(distance),
                    place: loc
                };
            }
        }
        return currentClosest;
    }
}
