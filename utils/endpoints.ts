export const Endpoints = {
  articles: (limit = 10, offset = 0) =>
    `/api/articles?limit=${limit}&offset=${offset}`,
  login: '/api/users/login',
  images: '/images'

};
