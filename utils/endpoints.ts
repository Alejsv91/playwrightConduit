export const Endpoints = {
  articles: (limit?: number, offset?: number) => {
    if (limit === undefined || offset === undefined) {
      return `/api/articles/`;
    }
    return `/api/articles?limit=${limit}&offset=${offset}`;
  },
  login: '/api/users/login',
  images: '/images'
};
