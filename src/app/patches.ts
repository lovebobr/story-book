export const patches = {
  login: {
    route: "/login",
    url: () => "/login",
  },

  signup: {
    route: "/signup",
    url: () => "/signup",
  },

  home: {
    route: "/",
    url: () => "/",
  },

  profile: {
    route: "/profile",
    url: () => "/profile",
  },

  book: {
    route: "/book/:id",
    url: ({ id }: { id: string }) => `/book/${id}`,
  },
};
