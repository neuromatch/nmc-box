import styled from "styled-components"
import { media } from "../../styles"

/**
 * A block containing star score and its label
 */
const StarScoreContainer = styled.div`
  display: flex;
  align-items: center;

  /**
  * p: label
  * div: star score
  */
  & > label,
  & > div {
    margin: 0;
  }

  & > label {
    margin-right: 15px;
  }

  /* push star to the next line on mobile screen */
  ${media.extraSmall`
   display: block;

   /* move stars to center */
   & > div {
     justify-content: center;
   }
 `}
`

export default StarScoreContainer
