export const routes = {
  home: "/",
  consultation: (slug: string) => `/consultation/${slug}`,
  consultationComplete: (slug: string) => `/consultation/${slug}/complete`,
} as const;
