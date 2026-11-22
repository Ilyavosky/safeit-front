let pendingToken: string | undefined;

export const mfaChallenge = {
  set(token: string) {
    pendingToken = token;
  },
  get() {
    return pendingToken;
  },
  clear() {
    pendingToken = undefined;
  },
};
