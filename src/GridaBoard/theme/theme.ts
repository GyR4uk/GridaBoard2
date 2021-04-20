import { createMuiTheme } from "@material-ui/core/styles";
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom : {
      grey : Array<string>
      white : Object,
      black : Object,
      icon :{
        blue : Array<string>
        mono : Array<string>
      },
      shadows: Array<string>
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom? : {
      grey? : Array<string>,
      white? : Object,
      black? : Object,
      icon? :{
        blue? : Array<string>
        mono? : Array<string>
      },
      shadows? : Array<string>
    }
  }
}
export const theme = createMuiTheme({
  custom:{
    white: {
      "90" : "rgba(255,255,255,0.9)",
      "80" : "rgba(255,255,255,0.8)",
      "25" : "rgba(255, 255, 255, 0.25)",
      "50" : "rgba(255, 255, 255, 0.5)"
    },
    black: {
      "5" : "rgba(0,0,0,0.05)"
    },
    grey: [
      "rgba(88, 98, 125, 0.75)",
      "#E5E5E5"
    ],
    icon:{
      blue : ["#313747","#58627D","#CED3E2","#E8ECF5", "#F5F5F9"],
      mono : ["#121212", "#828282", "#CFCFCF", "#E9E9E9", "#FFFFFF"]
    },
    shadows:[
      "2px 2px 2px rgba(0, 0, 0, 0.25)",
      "0px 0px 2px 2px rgba(0, 0, 0, 0.4) inset",
      "4px 4px 10px rgba(0, 0, 0, 0.3)"
    ]
  },
  palette: {
    primary: {
      light: "rgba(255, 255, 255, 0.5)",
      main: "#688FFF",
      // dark: "rgba(0,0,0,0.05)",
    },
    error: {
      main: "#ff0000",
    },
    background: {
      paper: "#FFFFFF", 
      default: "#EEEEEE",
    },
    text: {
      primary: "#121212",
      secondary: "#666666",
      // disabled: "#aaaaaa",
      hint: "rgba(0, 0, 0, 0.87)",
    },
    action: {
      hover: "rgba(104,143,255,1)",
      selected: "rgba(0, 0, 0, 0.10)",
    },
  },
  zIndex: {
    drawer: 1000,
  }
});
