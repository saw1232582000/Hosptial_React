import { selector } from "recoil";
import billFormAtom from "./atom";

const billFormWithBillItemsToadd = selector({
  key: "billFormWithBillItemsToadd",
  get: ({ get }) => {
    const billForm = get(billFormAtom);
    return billForm.billItemstoadd;
  },
  set: ({ get, set }, newValue) => {
    const billForm = get(billFormAtom);
    set(billFormAtom, {
      ...billForm,
      billItemstoadd: newValue,
    });
  },
});

export default billFormWithBillItemsToadd;
