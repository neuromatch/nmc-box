import styled, { keyframes } from "styled-components"

const Spinner = styled.div`
  border: 6px solid #ccc; /* Light grey */
  border-top: 6px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 25px;
  height: 25px;

  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1s linear infinite;
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid #bbb;
  border-radius: 5px;

  width: 144px;
  height: 38px;
`

export { Spinner, SpinnerContainer }
