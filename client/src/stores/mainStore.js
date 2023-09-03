export const mainStore = (set) => ({
  user: undefined,
  setUser: (user) => set((state) => ({ user })),
});
