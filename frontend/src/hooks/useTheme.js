import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

// -- CONSTANTS
const themes = {
  light: 'LIGHT',
  dark: 'DARK',
};
const defaultTheme = themes.light;
const themeCookieKey = 'theme';

// -- MAIN
const useTheme = () => {
  const [cookies, setCookie] = useCookies([themeCookieKey]);
  const [theme, setTheme] = useState(cookies[themeCookieKey] || defaultTheme);

  useEffect(() => {
    setCookie(themeCookieKey, theme);
  }, [setCookie, theme]);

  return {
    theme,
    setTheme,
  };
};

export default useTheme;
