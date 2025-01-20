const API_KEY = '48337516-7b7bbb1aa3939e40fc99ef59c';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchPhotos(query, page, perPage) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return await response.json();
}
