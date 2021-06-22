import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';

const Container = styled.div`
  text-align: center;
`;

export default () => (
  <Layout>
    <Container>
      <h1>
        Page not found
      </h1>
      <Link to="/">
        Go back
      </Link>
    </Container>
  </Layout>
);
