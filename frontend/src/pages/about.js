/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react"
import { CircleMarker, Map, Popup, TileLayer } from "react-leaflet"
import "react-medium-image-zoom/dist/styles.css"
import Layout from "../components/layout"
import useStatsData from "../hooks/gql/useStatsData"

export default () => {
  const statsData = useStatsData()

  return (
    <Layout>
      <h2>About</h2>
      <section>
        <p className="bold">
          Scientific conferences and meetings have an important role in
          research, but they also suffer from disadvantages that are barriers to
          the open and inclusive nature that is the ideal of many scientists. In
          particular, they can have prohibitive costs (financial, time away from
          home, carbon footprint) and they are often viewed as exclusive by
          scientists and trainees on the outside of existing powerful social
          networks. The COVID-19 pandemic has led to the cancellation of many
          conferences, forcing the scientific community to explore online
          alternatives. The Neuromatch vision is to foster inclusive global
          interactions for learning, mentorship, networking, and professional
          development in neuroscience through online community interactions and
          events.
        </p>
        <p>
          Earlier in 2020, there were two Neuromatch conferences that primarily
          focused on the computational neuroscience community. The events were
          successful and vibrant demonstrations of what can happen when the
          ideals of openness and inclusivity are used to rethink the conference
          experience. Following this, our partner organization Neuromatch
          Academy introduced a wildly successful global summer school
          experience. At the heart of these endeavors are the full exploitation
          of modern technology (including the Neuromatch algorithm, which links
          scientists according to text corpora analysis) to replace and enhance
          the most positive and beneficial aspects of interactions between
          scholars. Neuromatch 3.0 (running October 26 - 30, 2020) is a
          dramatically expanded version of this online conference format that
          includes the entire scope of neuroscience research. To cover our
          technical expenses, we are going to ask a nominal registration fee (in
          the range of $25) and it will be waivable by anyone who lacks the
          resources or the means to pay.
        </p>
        <p>
          In Neuromatch 3.0, a key innovation will be to reduce the amount of
          editorial influence used to select which presentations are considered
          valuable to the community. To do this, we aim to minimize notions of
          prestige associated with different presentation formats and scheduling
          (e.g., single vs. multiple track slots). Submissions will only be
          rejected for obvious irrelevance to the neuroscience community.
          Submitters will self-select between talk and “poster” formats, which
          is fundamentally distinguished by the presentation length and
          willingness to be interrupted for conversation during the material.
          Presentation scheduling will be based on measured audience interest
          (aided by our matching algorithms and using blinded abstracts) rather
          than editorial decisions about what should be viewed as most
          important. In this model, the program committee only selects a small
          number of keynote talks for each technical theme.
        </p>
        <p>
          We hope that these efforts will give a sustainable way to increase the
          openness, transparency, diversity and inclusivity in global scientific
          conferences both within neuroscience as well as other disciplines.
          Please take a look at abstract submission and key dates, registration,
          and agenda information. Come join us!
        </p>
      </section>
      <section>
        <h3>The team</h3>
        <p>
          <span className="bold">Organizers</span>
          {" · "}
          Dan Goodman (Imperial), Konrad Kording (UPenn), Brad Wyble (Penn
          State), Titipat Achakulvisut (UPenn), Tim Vogels (Oxford), Chris
          Rozell (Georgia Tech), Yiota Poirazi (IMBB/FORTH), Megan Peters (UC
          Irvine)
          <br />
          <span className="bold">Career</span>
          {" · "}
          Brad Wyble (Penn State), Ida Momennejad (Columbia), Maria Reva (EPFL)
          <br />
          <span className="bold">Tech</span>
          {" · "}
          Tulakan Ruangrong (Mahidol U), Titipat Achakulvisut (UPenn)
        </p>
      </section>
      <section>
        <h3>Previous offerings featured in articles and news outlets</h3>
        <p>You can read about neuromatch from following articles and news</p>
        <ul>
          <li>
            Achakulvisut, Titipat, et al. &ldquo;Towards Democratizing and
            Automating Online Conferences: Lessons from the Neuromatch
            Conferences.&rdquo; Trends in Cognitive Sciences (2021). doi:{" "}
            <a href="https://www.sciencedirect.com/science/article/pii/S1364661321000097">
              10.1016/j.tics.2021.01.007.
            </a>
          </li>
          <li>
            Achakulvisut, Titipat, et al. &ldquo;Point of View: Improving on
            legacy conferences by moving online.&rdquo; eLife 9 (2020). doi:{" "}
            <a href="https://elifesciences.org/articles/57892">
              10.7554/eLife.57892.
            </a>
          </li>
          <li>
            Achakulvisut, Titipat, et al.{" "}
            <a href="https://elifesciences.org/labs/5ed408f4/neuromatch-algorithms-to-match-scientists">
              &ldquo;neuromatch: Algorithms to match scientists.&rdquo;
            </a>{" "}
            eLife Labs (2020).
          </li>
          <li>
            A match for virtual conferences. Nature Machine Intelligence 2, 239
            (2020). doi:{" "}
            <a href="https://doi.org/10.1038/s42256-020-0182-5">
              https://doi.org/10.1038/s42256-020-0182-5
            </a>
          </li>
          <li>
            How to run big (neuro) science conferences online—neuromatch.io
            (2020).{" "}
            <a href="https://medium.com/@kording/how-to-run-big-neuro-science-conferences-online-neuromatch-io-49c694c7e65d">
              Medium
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h3>Thanks all participants!</h3>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/hashtag/neuromatch2020"
          >
            #neuromatch2020
          </a>{" "}
          is truely an international unconference. You can see the registration
          locations below:
        </p>
        {typeof window !== "undefined" ? (
          <Map
            center={[25.0, 0.0]}
            zoom={1.5}
            css={`
              height: 500px;
              background: #ddd;
            `}
          >
            <TileLayer
              url="http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}{r}.png"
              attribution='
                  Map Tiles by
                  <a href="https://stamen.com">Stamen Design</a>,
                  under <a href="http://creativecommons.org/licenses/by/3.0">CC-BY-3.0</a>,
                  Data by
                  <a href="http://openstreetmap.org">OpenStreetMap</a>
                  contributors, under
                  <a href="http://creativecommons.org/licenses/by-sa/3.0">CC-BY-SA</a>
                '
            />
            {statsData.map(loc => (
              <CircleMarker
                center={loc.position}
                key={loc.location}
                radius={loc.n_users / 3}
                color="#060506"
                fillOpacity="0.5"
                stroke={false}
                onMouseOver={e => e.target.openPopup()}
                onMouseOut={e => e.target.closePopup()}
                onFocus={e => e.target.openPopup()}
                onBlur={e => e.target.closePopup()}
              >
                <Popup closeButton={false}>
                  <b>{`📍 ${loc.location}`}</b>
                  <br />
                  {`🧠 ${loc.n_users} participants`}
                </Popup>
              </CircleMarker>
            ))}
          </Map>
        ) : null}
      </section>
    </Layout>
  )
}
