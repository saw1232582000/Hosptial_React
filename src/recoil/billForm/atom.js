import { atom } from "recoil";

const billFormAtom = atom({
  key: "billFormAtom",
  default: {
    currentPatient: null,
    totalDeposit: 0,
    billItems: [],
    billItemstoadd:[],
  },
});

export default billFormAtom;
