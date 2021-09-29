import styled from "styled-components"

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  input:not([type="range"]) {
    padding: 2px 8px;
  }

  textarea {
    /* 30 on the right for the remove button */
    padding: 2px 30px 2px 8px;
  }

  input:not([type="range"]),
  textarea,
  select {
    border: 1px solid ${p => p.theme.colors.disabled};
    border-radius: 3px;
  }
`

export default InputContainer
