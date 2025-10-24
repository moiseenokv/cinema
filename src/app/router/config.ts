export const routes = {
  home: '/',
  films: '/films',
  film: (id: string | number = ':id') => `/film/${id}`,
  cinemas: '/cinemas',
  cinema: (id: string | number = ':id') => `/cinema/${id}`,
  myTickets: '/my-tickets',
  auth: '/auth',
  register: '/register',
  notFound: '/404',
  wildcard: '*',
} as const;