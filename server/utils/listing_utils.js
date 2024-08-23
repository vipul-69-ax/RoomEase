async function geocodeAsync(address) {
  try {
    const request = await fetch(
      `https://geocode.maps.co/search?q="${address}"&api_key=668818d3754d5185164767ldxfd4b95`,
    );
    const response = await request.json();
    return {
      lat: response[0].lat,
      lon: response[0].lon,
    };
  } catch (err) {
    return undefined;
  }
}
