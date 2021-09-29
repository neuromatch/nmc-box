import styled from 'styled-components';
import { media, growOverParentPadding } from '../../styles';

const Card = styled.div`
  /* center the whole form wrapper card */
  margin: 0 auto;

  display: flex;
  flex: 1;

  /* make this looks like a card */
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.secondary};
  box-shadow: 2px 2px 6px 2px ${p => p.theme.colors.disabled};

  /* space between box */
  padding: 1.5em;
  margin-bottom: 1em;

  /* space from last box to the next element */
  :last-child {
    margin-bottom: 2em;
  }

  /* grow full width in mobile screen */
  ${media.extraSmall`
    ${growOverParentPadding(98)}

    padding: 1em 0.5em;
  `}
`;

export default Card;
