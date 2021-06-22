import React from 'react';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import { AcademyLayout } from '../../components/layout';

export default () => (
  <AcademyLayout>
    <CommonPageStyles>
      <h2>About</h2>
      <p>
        Neuromatch Academy is run by volunteers to provide an accessible online
        computational neuroscience summer school developed in response to the
        COVID-19 pandemic. The initiative stemmed from organizers of the
        {' '}
        <a
          href="http://www.compneurosci.com/CoSMo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CoSMo summer school
        </a>
        {' '}
        and the
        {' '}
        <a
          href="https://neuromatch.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Neuromatch online
        </a>
        {' '}
        conference.
      </p>
      <p>
        The Academy aims to replicate certain key features of traditional summer
        schools such as:
      </p>
      <ul type="circle">
        <li>
          Lectures by expert neuroscientists
        </li>
        <li>
          Intensive tutorials and hands-on research projects
        </li>
        <li>
          Networking with other students, TAs, and faculty mentors
        </li>
        <li>
          Help with professional development and research skills
        </li>
        <li>
          Socializing
        </li>
      </ul>
      <p>
        But it also has a special focus on:
      </p>
      <ul type="circle">
        <li>
          &quot;Mind matching&quot; -- algorithmically matching students,
          TAs, and faculty mentors to ensure productive interactions
          around shared interests
        </li>
        <li>
          Meta-modeling -- explicitly discussing the &quot;why&quot;
          and &quot;how&quot; of selecting models and methods, beyond
          just the technical details
        </li>
        <li>
          Being for whoever, wherever -- little to no fee, TA groups
          across multiple time zones (some with multiple languages
          available), and publicly released course materials
        </li>
      </ul>
      <p>
        For more on the origin and ethos of the school, please see our
        {' '}
        <a
          href="https://docs.google.com/document/d/1ta2XVAe24v43Lvvsdev71JCh8lGuzZIrBh4wzmi2KVo/edit"
        >
          Mission Statement
        </a>
        .
      </p>
      <h3>The Structure</h3>
      <p>
        The school will take place over three weeks (July 13-31, 2020),
        with 6+ hours of lectures and practical work per day.
      </p>
      <p>
        Participants will fall into different categories:
      </p>
      <ul type="circle">
        <li>
          Observer vs. Interactive: Observers will have access to the
          course materials including lectures and tutorials but will
          not participate in TA pods, projects, or targeted mentoring.
          Interactive students will receive the full Neuromatch Academy
          experience.
        </li>
        <li>
          Beginner/Intermediate vs. Intermediate/Advanced: Different
          goals will be provided for students with different skill
          sets to facilitate individualized learning.
        </li>
      </ul>
      <p>
        The school aims to have several thousand students, with roughly
        one-third participating as interactive students. The ratio of TAs
        to interactive students will be about 1:6-8. TAs will be matched
        to students based on research interests, time zones, languages
        and skill level.
      </p>
      <h3>Finances</h3>
      <p>
        The school is generously supported by many sponsors. The most
        up-to-date list of formal sponsors can be found on
        {' '}
        <a
          href="https://neuromatch.io/academy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          the main page
        </a>
        .
      </p>
      <p>
        Costs of running the school are minimal because it is virtual.
        The main costs include:
      </p>
      <ul type="circle">
        <li>
          TA compensation (this comprises &gt;80&#37; of costs)
        </li>
        <li>
          Software subscription and other tech needs
        </li>
        <li>
          Conference and financial management services
        </li>
      </ul>
      <p>
        A small fee for full-time students/academics on the Interactive track
        may be applied to offset costs (with fee waivers available).
      </p>
      <h3>After the school</h3>
      <p>
        The impact of the school will extend beyond its three weeks.
        This will occur through:
      </p>
      <ul type="circle">
        <li>
          Course materials hosted online, available to everyone
        </li>
        <li>
          Publications, including in a special issue of the
          {' '}
          <a
            href="https://nbdt.scholasticahq.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NBDT journal
          </a>
        </li>
        <li>
          Future iterations of the school, as a complement to
          traditional in-person summer schools
        </li>
      </ul>
      <h3>Who we are</h3>
      <p>
        The school is organized and run by an extensive team of volunteers.
        Executive committee members include:
      </p>
      <ul type="circle">
        <li>
          Megan Peters (University of California, Irvine) - Chair
        </li>
        <li>
          Eric DeWitt (Champalimaud Research) - Co-Chair
        </li>
        <li>
          Brad Wyble (Pennsylvania State University) - Co-Chair
          and Chair of Diversity
        </li>
        <li>
          Emma Vaughan (IBRO-Simons Computational Neuroscience
          Imbizo) - Administrative Chair
        </li>
        <li>
          Konrad Kording (University of Pennsylvania)
        </li>
        <li>
          Gunnar Blohm (Queen’s University) - Chair of Curriculum
        </li>
        <li>
          Paul Schrater (University of Minnesota) - Chair of Projects
        </li>
        <li>
          Sean Escola (Columbia University) - Chair of Fundraising
          &amp; Development
        </li>
        <li>
          Patrick Mineault - Chair of Technical
        </li>
        <li>
          Grace Lindsay (University College London) - Chair of
          Communication &amp; Outreach
        </li>
        <li>
          John Murray (Yale University) - Chair of Faculty Recruitment
        </li>
        <li>
          Carsen Stringer (HHMI Janelia Research Campus) - Chair of
          TA Recruitment
        </li>
        <li>
          Alex Hyafil (Centre de Recerca Matemàtica) - Chair of
          Regional/Timezone/Language
        </li>
        <li>
          Aina Puce (University of Indiana, Bloomington) - Chair of
          Student Recruitment
        </li>
        <li>
          Athena Akrami (Sainsbury Wellcome Centre, UCL) - Chair of
          Mentor Recruitment
        </li>
      </ul>
      <h3>Contact</h3>
      <p>
        neuromatchacademy@neuromatch.io |
        {' '}
        <a href="https://twitter.com/neuromatch">@neuromatch</a>
      </p>
    </CommonPageStyles>
  </AcademyLayout>
);
