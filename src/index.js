import React from "react";
import ReactDOM from "react-dom";
import MDPreviewer from "./MDPreviewer";

import { CssBaseline, ThemeProvider } from "@mui/material";
import myTheme from "./themes/myTheme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <MDPreviewer />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
