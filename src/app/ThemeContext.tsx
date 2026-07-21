import { createContext, useContext } from "react";

export const ThemeContext = createContext<boolean>(true); // true = dark

export const useTheme = () => useContext(ThemeContext);
