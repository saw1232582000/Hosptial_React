import { createTheme } from "@mui/material";
import { constants } from "./common/utils/constants";

export const theme = createTheme({
    palette: {
      primary: {
        main: constants.primary_color,
      },
    },
  });