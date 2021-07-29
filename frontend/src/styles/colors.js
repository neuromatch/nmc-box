// primary -> background
// secondary -> text, border (shift tone down)
// accent -> link
// succeed -> accept button, ...
// danger -> reject button, ...
// info -> inform
// warning -> warn
// agenda colors may need handpick -> how to deal with dark/light mode?

const createColorObject = ({
  primary,
  secondary,
  accent,
  succeed,
  danger,
  info,
  warning,
}) => ({
  background: primary,
  text: secondary,
  border: secondary,
  link: accent,
});

// need color function to calculate contrast and tone-shift color

const lightColors = createColorObject();
const darkColors = createColorObject();
