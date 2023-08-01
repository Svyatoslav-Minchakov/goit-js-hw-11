


export async function getImageCollection() {
  return await fetch(`${BASE_URL}?key=${API_KEY}&q=${enterValue}&image_type=photo`);
}