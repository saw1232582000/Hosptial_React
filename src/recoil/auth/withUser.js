import { selector } from "recoil";
import authAtom from "./atom";

import jwtDecode from "jwt-decode";

const authWithUser = selector({
  key: "authWithUser",
  get: ({ get }) => {
    const authTokens = get(authAtom);
    if (authTokens) {
      return jwtDecode(authTokens.access_token);
    }
    return null;
  },
  set: ({ get, set }, newValue) => {
    set(authAtom, newValue);
  },
});

export default authWithUser;
