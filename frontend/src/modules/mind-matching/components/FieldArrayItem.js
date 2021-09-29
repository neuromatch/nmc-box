import styled from "styled-components"

const FieldArrayItem = styled.li`
  margin-bottom: 0;
  display: flex;
  position: relative;

  /* last child is next to warning message that we don't need margin */
  :not(:last-child) {
    margin-bottom: 6px;
  }

  /*
  <InputWithSuggestion> is a div wrapping input
  and suggestion ul inside
  */
  textarea,
  div {
    flex: 1;
  }
`

export default FieldArrayItem
