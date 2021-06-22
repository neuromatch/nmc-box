// import React from 'react';
import styled from 'styled-components';

const CommonPageStyles = styled.div`
  margin-bottom: 2.5em;

  code {
    font-size: 1em;
    color: #000;
  }

  h2,
  h3,
  h4 {
    font-weight: bold;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1.05em;
    margin-bottom: 1em;
  }

  li {
    h3,
    ul {
      margin-bottom: 0.5em;
    }
  }

  hr {
    background-color: #333;
  }

  .bold {
    font-weight: bold;
  }
`;

export default CommonPageStyles;
