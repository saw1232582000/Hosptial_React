import { atom } from "recoil";

const authAtom = atom({
  key: "authAtom",
  default: 
    localStorage.getItem("my-genesis-auth-tokens")
    ? JSON.parse(localStorage.getItem("my-genesis-auth-tokens"))
    : 
    null,
});

export default authAtom;
