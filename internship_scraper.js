/*
 * This script scrapes internships from HTML on a site.
 * To use, copy and paste this code into the javscript console.
 * A .txt file with all of the internship information will be downloaded after the scrape is done.
 */

const WAIT_TIME = 2000; // Value in ms, suggested value is 4000 to allow page to fully load
const CURR_DATE = (new Date().toLocaleDateString()).replaceAll("/", "-");
const DOWNLOAD_FILE_NAME = `Scraped Internships (${CURR_DATE}).txt`;
const DOWNLOAD_FILE_NAME_KEYS = `Scraped Internships Company Names (${CURR_DATE}).txt`;

/*
 * Wait function to prevent next line to run until time has passed.
 */
function wait(timeout_ms) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout_ms);
    });
}

/*
 * Function to download information from console.
 */
const download = async (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


/*
 * Scrapes all internships for filtered criteria. 
 * 
 * @return positions: []
 * @return companes: []
 * @return locations: []
 */
const searchAndSaveRows = async () => {
    let positions = [];   //position titles
    let companies = [];   //company titles
    let locations = [];   //location titles

    // Get all buttons to navigate pages
    let raw_lis = document
        .querySelectorAll(".pagination.pagination ul")[0]
        .querySelectorAll("li:not(.disabled)")

    // Filter for buttons with page numbers
    let lis = Array.prototype.slice.call(raw_lis)
        .filter(li => !isNaN(li.textContent));

    // Iterate through each page
    for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        console.log("Scraping page:", i + 1);

        // Click current page number button
        li.querySelector("a").click();

        // Let page load
        await wait(WAIT_TIME);

        let tableRows = document.querySelectorAll("#postingsTable tr");               //Selects all rows in table
        let posTitles = document.querySelectorAll(".orgDivTitleMaxWidth span a");     //Selects all position titles

        for (let i = 0; i < posTitles.length; i++) {
            positions.push(posTitles[i].textContent.trim());
        }

        // Puts all the companies into an array
        for (let i = 1; i < tableRows.length; i++) {
            companies.push(tableRows[i].querySelectorAll("td")[4].textContent.trim());
            locations.push(tableRows[i].querySelectorAll("td")[8].textContent.trim());
        }

    }

    console.log("");
    console.log(`Scraped ${companies.length} postings.`);

    return {
        positions,
        companies,
        locations,
    }
}

/*
 * Takes scraped information as arrays and creates clean json of all internships.
 * Internships contains an array of positions and locations for each company.
 * 
 * @param positions: []
 * @param companes: []
 * @param locations: []
 * @return internships: {}
 */
const createInternshipsObj = async (companies, positions, locations) => {
    let internships = {};

    // Creates internship objects
    for (let i = 0; i < companies.length; i++) {

        // Create company if company doesn't exist
        if (Object.keys(internships).indexOf(companies[i]) === -1) {
            internships[companies[i]] = {
                positions: [],
                locations: [],
            };
        }

        let internship = internships[companies[i]];

        // Check if position exists in company object
        if (internship.positions.indexOf(positions[i]) === -1) {
            internship.positions.push(positions[i]);
        }

        // Check if location exists in company object
        if (internship.locations.indexOf(locations[i]) === -1) {
            internship.locations.push(location[i]);
        }
    }

    await wait(WAIT_TIME);

    console.log("")
    console.log(`Found information about ${Object.keys(internships).length} companies`);

    return internships
}

const init = async () => {
    console.log("=".repeat(10), "STARTING SCRAPE", "=".repeat(10));

    const { companies, positions, locations } = await searchAndSaveRows();
    const internships = await createInternshipsObj(companies, positions, locations);

    console.log("")
    console.log("Downloading file now...");

    await download(DOWNLOAD_FILE_NAME, JSON.stringify(internships));
    await wait(WAIT_TIME);
    await download(DOWNLOAD_FILE_NAME_KEYS, JSON.stringify(Object.keys(internships)));
    await wait(WAIT_TIME);

    console.log("Download completed.")

    await wait(300);

    console.log("=".repeat(10), "FINISHED SCRAPE", "=".repeat(10));
}

await init();





