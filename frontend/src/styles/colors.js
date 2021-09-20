// primary -> background
// secondary -> text, border (shift tone down)
// accent -> link
// succeed -> accept button, ...
// danger -> reject button, ...
// info -> inform
// warning -> warn
// agenda colors may need handpick -> how to deal with dark/light mode?

const colors = {
  light: {
    primary: 'rgba(255,255,255,1)',
    secondary: 'rgba(34,34,34,1)',
    accent: 'rgba(65,158,218,1)',
    disabled: 'rgba(187,187,187,1)',
    succeed: 'rgba(34,204,34,1)',
    danger: 'rgba(226,63,63,1)',
    info: 'rgba(116,209,255,1)',
    warning: 'rgba(255,165,0,1)',
    black: 'rgba(34,34,34,1)',
    white: 'rgba(255,255,255,1)',
    grey: 'rgba(204,204,204,1)',
    factor: -1,
  },
  dark: {
    primary: 'rgba(34,34,34,1)',
    secondary: 'rgba(238,238,238,1)',
    accent: 'rgba(91,184,244,1)',
    disabled: 'rgba(187,187,187,1)',
    succeed: 'rgba(98,255,98,1)',
    danger: 'rgba(255,101,101,1)',
    info: 'rgba(154,247,255,1)',
    warning: 'rgba(255,203,38,1)',
    black: 'rgba(34,34,34,1)',
    white: 'rgba(238,238,238,1)',
    grey: 'rgba(204,204,204,1)',
    factor: 1,
  },
};

export default colors;
