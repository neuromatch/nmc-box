import React from 'react';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import Layout from '../components/layout';

export default () => (
  <Layout>
    <CommonPageStyles>
      <h2>Companions</h2>
      <p>
        Our neuromatch team strives to make the neuroscience community better by
        addressing diversity and inclusivity. Therefore, we support initiatives
        including early-career scientists, neuroscience events, hackathon,
        summer schools, students who want to learn neuroscience, etc. Please
        email or reach out to organizers if you want to be a part of it. Below
        is the list of our companions:
      </p>
      <h3>eLife partnership</h3>
      <p>
        We partner with eLife journal where they host online seminars to support
        early-career researchers during COVID-19 pandemic. They want to make
        sure early-career researchers (ECRs) can continue to communicate their
        latest work to their peer. Please check out the full details and their
        talks at neuromatch
        {' '}
        <a
          href="https://elifesciences.org/inside-elife/1a9d9c08/elife-and-covid-19-keeping-communications-open-with-online-research-talks"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <h3>BrainWeb</h3>
      <p>
        This is one way that you can keep connecting with the community.
        BrainWeb is a permanent online space for neuroscience collaboration: to
        work together no matter where we are. Kicking-off on April 6, 2020, at 3
        PM UTC, followed by a 3-days Hackathon. Find more information and join
        the community on our website
        {' '}
        <a
          href="https://brain-web.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          brain-web.github.io
        </a>
        {' '}
        and follow us on Twitter
        {' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/TheBrainWeb"
        >
          @TheBrainWeb
        </a>
        .
      </p>
      <h3>XhM Foundation</h3>
      <p>
        Following the neuromatch 2.0 meeting, we will have an ancillary event:
        Neuroscience for Kosovo: neural circuits and dynamics during behaviour.
        The focus will be on mobilizing support and highlighting more exciting
        neuroscience research. It will fundraise for the XhM foundation whose
        aim is to motivate young Kosovans to pursue STEM careers through
        scholarships, mini-educational programs and other activities, and during
        these trying times, any additional proceeds will be donated to Kosovo’s
        COVID-19 relief programme. Everyone will be equally invited to
        participate. Please check out more information and support them
        {' '}
        <a
          href="https://www.xhmfoundation.com/mission-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <h3>Virtual Working Memory 2020 Symposium (Virtual WM 2020 Symposium)</h3>
      <p>
        Announcing a one-off, student-centered, free virtual conference addressing all
        things working memory. This meeting – loosely modeled on neuromatch– to is meant
        provide a venue for trainees affected by recent conference cancellations to
        present their work and network with like-minded scientists. All are welcome,
        but presentations will be limited to undergraduate students, graduate students,
        and postdocs. The conference will be held June 1st-4th 2020, with live sessions
        from ~ 8 am and 6 pm EST (GMT -04). More information and a registration link can be
        found
        {' '}
        <a
          href="https://bit.ly/2VCkqBR"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
    </CommonPageStyles>
  </Layout>
);
