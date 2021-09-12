import styled from "styled-components"

const HeadingWithButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.55em;

  * {
    margin: 0;
  }

  button {
    font-size: 0.85em;
    /* height: 2.5em; */
    :nth-child(2) {
      margin-right: 0;
    }
  }
`

export default HeadingWithButtonContainer
