import { createTheme } from "@mui/material";
import { red, blueGrey } from "@mui/material/colors";

const myTheme = createTheme({
  palette: {
    mode: "dark",
    primary: red,
    secondary: blueGrey,
  },
});

export default myTheme;
