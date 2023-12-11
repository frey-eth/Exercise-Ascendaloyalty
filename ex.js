const fs = require("fs");

function loadJSON(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function filterOffers(checkinDate, inputData) {
  const filteredOffers = [];

  checkinDate = new Date(checkinDate);

  for (const offer of inputData.offers) {
    if ([1, 2, 4].includes(offer.category)) {
      const validToDate = new Date(offer.valid_to);
      if (
        validToDate >= new Date(checkinDate.getTime() + 5 * 24 * 60 * 60 * 1000)
      ) {
        offer.merchants.sort((a, b) => a.distance - b.distance);
        offer.merchants = [offer.merchants[0]];

        filteredOffers.push(offer);
      }
    }
  }

  filteredOffers.sort((a, b) => {
    return (
      a.category - b.category ||
      a.merchants[0].distance - b.merchants[0].distance
    );
  });

  const selectedOffers = [];
  const categories = new Set();

  for (const offer of filteredOffers) {
    if (!categories.has(offer.category)) {
      selectedOffers.push(offer);
      categories.add(offer.category);
    }

    if (selectedOffers.length === 2) {
      break;
    }
  }

  return { offers: selectedOffers };
}

function main(checkinDate) {
  const inputFilePath = "input.json";
  const outputFilePath = "output.json";

  const inputData = loadJSON(inputFilePath);
  const filteredData = filterOffers(checkinDate, inputData);
  saveJSON(outputFilePath, filteredData);
}

const checkinDate = "2019-12-25";
main(checkinDate);
