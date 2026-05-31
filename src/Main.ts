import * as Plugin from "iitcpluginkit";
import OpenLocationCode from "open-location-code-typescript";


const URI = "https://plus.codes/";

class GPlusCodes implements Plugin.Class {

    init() {
        window.addHook("search", this.onSearch)
    }

    onSearch(search: IITC.SearchQuery) {
        const term = search.term.replace(URI, "")
        if (OpenLocationCode.isFull(term)) {
            const result = OpenLocationCode.decode(term);
            search.addResult({
                title: "GPlusCode: " + term,
                description: "Lat: " + result.latitudeCenter + ", Lng: " + result.longitudeCenter,
                position: {
                    lat: result.latitudeCenter,
                    lng: result.longitudeCenter
                }
            })
        }
        /*
        if (search.confirmed) {
            // Requires API-Key (Geolocation API - price 4,2€ per 1000 requests after 10thousand free requests)
            const result = await fetch("https://plus.codes/api?address=" + search.term.replace(URI, ""))
            console.log(result);
        }
            */

    }

}

/**
 * use "main" to access you main class from everywhere
 * (same as window.plugin.GPlusCodes)
 */
export const main = new GPlusCodes();
Plugin.Register(main, "GPlusCodes");
