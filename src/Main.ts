import * as Plugin from "iitcpluginkit";
import OpenLocationCode from "open-location-code-typescript";


const URI = "https://plus.codes/";

class GPlusCodes implements Plugin.Class {

    init() {
        window.addHook("search", this.onSearch)
    }

    async onSearch(search: IITC.SearchQuery) {
        const term = search.term.replace(URI, "")
        if (OpenLocationCode.isFull(term)) {
            const result = OpenLocationCode.decode(term);
            search.addResult({
                title: `GPlusCode: ${term}`,
                description: `Lat: ${result.latitudeCenter.toFixed(6)}, Lng: ${result.longitudeCenter.toFixed(6)}`,
                position: {
                    lat: result.latitudeCenter,
                    lng: result.longitudeCenter
                }
            })
        } else {


        if (search.confirmed) {
            const term = search.term.replace(URI, "")
            const code = term.substring(0, term.indexOf(' '));
            const city = term.substring(term.indexOf(' ') + 1); 
            if (OpenLocationCode.isShort(code)) {
                if  (city) {
                    var url = new URL("https://nominatim.openstreetmap.org/search?format=json");
                    url.searchParams.set('q', city);
                    const response = await fetch(url)
                    if (!response.ok) {
                        console.error("Failed to fetch city coordinates for " + city, response.statusText);
                        return;
                    }

                    const cities = await response.json();
                    const cityLocation = cities[0]; // just pick first match
                    if (!cityLocation) {
                        console.error("Failed to fetch cityLocation for " + city, cities);
                        return;
                    }

                    const fullcode = OpenLocationCode.recoverNearest(code, parseFloat(cityLocation.lat), parseFloat(cityLocation.lon));
                    const result = OpenLocationCode.decode(fullcode);
                    search.addResult({
                        title: `GPlusCode: ${term}`,
                        description: `Lat: ${result.latitudeCenter.toFixed(6)}, Lng: ${result.longitudeCenter.toFixed(6)}`,
                        position: {
                            lat: result.latitudeCenter,
                            lng: result.longitudeCenter
                        }
                    })
                }
            }

        }
        }

    }

}

/**
 * use "main" to access you main class from everywhere
 * (same as window.plugin.GPlusCodes)
 */
export const main = new GPlusCodes();
Plugin.Register(main, "GPlusCodes");
