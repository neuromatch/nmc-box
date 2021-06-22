import React from 'react';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import { AcademyLayout } from '../../components/layout';

export default () => (
  <AcademyLayout>
    <CommonPageStyles>
      <h2>FAQ</h2>
      <h3 id="about-neuromatch-academy">About Neuromatch Academy</h3>
      <h4>Q: What is Neuromatch Academy?</h4>
      <p>
        A: Neuromatch Academy is a massive, interactive, online summer school
        experience spanning from hands-on modeling experience to meta-science
        interpretation skills across just about everything that could be
        reasonably included in the label &quot;computational neuroscience&quot;.
        We&apos;re a group of neuroscientists from around the globe who have run
        smaller, in-person summer schools in the past, but that&apos;s not
        possible this year due to COVID-19 pandemic.
      </p>
      <h4>Q: What makes it special?</h4>
      <p>
        A: We are aiming to provide equal access to excellent computational
        neuroscience training for all students regardless of geography,
        nationality, socioeconomic status, or other factors. Also, unlike most
        other online courses, we have TAs. Plus, there will be lots of
        scientific networking through matchmaking algorithms. And it&apos;s the
        first of its kind and that&apos;s pretty special, right?.
      </p>
      <h4>Q: Why should I sign up for Neuromatch Academy?</h4>
      <p>
        A: If you have ever wanted to learn about computational neuroscience,
        this is your chance! We don&apos;t just teach you the skills; we will
        also teach you how to use those skills to answer neuroscience questions.
        And it will be a lot of fun!
      </p>
      <h4>Q: What topics will be covered in the course?</h4>
      <p>
        A: An integrated, scientific inquiry-based curriculum with instruction
        in core topics of neural data science and computational neuroscience
        such as dimensionality reduction, neuron models, network dynamics,
        Bayesian modeling, and deep learning. We have a large focus on
        meta-modeling, too: how to choose the right model for your dataset and
        question, and what insights each approach can provide. See our
        {' '}
        <a
          href="https://github.com/NeuromatchAcademy/course-content"
          target="_blank"
          rel="noopener noreferrer"
        >
          syllabus
        </a>
        .
      </p>
      <h4>Q: When will the tentative programme be available on the website?</h4>
      <p>
        A: We have a
        {' '}
        <a
          href="https://github.com/NeuromatchAcademy/course-content"
          target="_blank"
          rel="noopener noreferrer"
        >
          syllabus
        </a>
        {' '}
        and
        {' '}
        <a
          href="https://github.com/NeuromatchAcademy/precourse"
          target="_blank"
          rel="noopener noreferrer"
        >
          pre-course reading
        </a>
        {' '}
        available now. We&apos;re working on a more detailed plan of the daily
        structure and will have it to you as soon as possible.
      </p>
      <h4>Q: What is the structure of the course?</h4>
      <p>
        A: Each day has a series of modules (10min lecture, 20min hands-on
        tutorial), a keynote / interpretation session, and professional
        development activities. Small-group projects (Interactive track) happen
        afterwards. Lectures will be pre-recorded; TA modules, projects, and
        other activities will be live.
      </p>
      <h4>Q: How do students get grouped into teams or &apos;pods&apos;?</h4>
      <p>
        A: We use an algorithm (
        <a
          href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0158423"
          target="_blank"
          rel="noopener noreferrer"
        >
          cite 1,
        </a>
        {' '}
        <a
          href="https://elifesciences.org/articles/57892"
          target="_blank"
          rel="noopener noreferrer"
        >
          cite 2,
        </a>
        {' '}
        <a
          href="https://github.com/titipata/paper-reviewer-matcher"
          target="_blank"
          rel="noopener noreferrer"
        >
          cite 3
        </a>
        ) to place people in complementary groups based on common interests and
        background knowledge, according to a textual analysis of their existing
        research. We will use a few abstracts from each participant to identify
        who has similar interests. You don&apos;t need to have any publications
        to do this -- you can also write an abstract about things you&apos;re
        working on or want to work on, or submit (copy-paste) abstracts written
        by other people that you find interesting. We&apos;ll ask for these
        abstracts and more info in Round 2 applications.
      </p>
      <h4>
        Q: How big is each &apos;pod&apos; or team of students who work with 1 TA?
      </h4>
      <p>
        A: Each &apos;pod&apos; will consist of 2 TAs working together with
        roughly 20 students. Therefore the TA to student ratio is &#126;1&#58;10.
      </p>
      <h4>Q: What are group projects?</h4>
      <p>
        A: There are small-group (3-5 students from your pod) projects for
        students in the Interactive track. This is a fun way to apply hands-on
        skills to your own topic of interest! We will step-by-step mentor you
        in how to model and the projects will also be supervised by TAs.
      </p>
      <h4>Q: What&apos;s the professional development aspect?</h4>
      <p>
        A: Each day, professional mentors will be providing career advice to
        individuals or small groups.
      </p>
      <h4>
        Q: What time zone will it take place in? What if I am not in the
        timezone of the school? How will I access the lectures and my
        &quot;pod&quot;?
      </h4>
      <p>
        A: We will have TA-facilitated pods accessible in real time from all
        timezones in the world. When you sign up and commit to attending the
        Interactive track you will be asked for your timezone so we can place
        you in a group that operates in your preferred timezone. Lectures and
        tutorials will (likely) be pre-recorded with multiple live Q&amp;A
        sessions spanning multiple timezones to give you a chance to ask
        questions to the instructors in a live setting.
      </p>
      <h4>Q: Will the courses be in any languages other than English?</h4>
      <p>
        A: The main language of instruction will be English, and all materials
        will be in English. We are currently exploring whether we can group
        students into &quot;pods&quot; with a TA who also speaks a language of
        your choice in addition to English, so if this is something you are
        interested in, please indicate it in your application.
      </p>
      <h4>
        Q: How long can I access the lectures and materials for after the
        school?
      </h4>
      <p>A: Everything will be freely available after the school on Github.</p>
      <h4>
        Q: Can I have access to a list of all participants and TAs before or
        after the school, so I can set up my own networking opportunities after
        the school?
      </h4>
      <p>
        A: All participants will be able to opt in to sharing their contact
        information.
      </p>
      <hr />
      <h3 id="interactive-versus-observer-tracks">
        Interactive versus Observer Tracks
      </h3>
      <h4>Q: What is the Interactive vs Observer track?</h4>
      <p>
        A: The Interactive track will involve 6+ hours a day of lectures and
        small-group project work with a TA and a pod of other students who have
        similar interests, language preferences and time zone requirements. Pods
        will be divided into two groups of roughly 4, each of which work on a
        project together. The Observer track will have access to the course
        materials but will not participate in the TA-facilitated live coding
        pods, group projects, or other interactive mentorship components.
      </p>
      <h4>Q: Will Observer Track students receive certificates?</h4>
      <p>
        A: Observers will not receive the same certificate of completion given
        to Interactive participants, however other indications of participation
        may be possible depending on what aspects of the course the observer
        completes.
      </p>
      <h4>
        Q: Can I switch from Observer track to Interactive track and the other
        way round once I have submitted my application, or once the school has
        begun?
      </h4>
      <p>
        A: Switching tracks is possible, but only up to a certain point. There
        will be a final decision date at which you will have to commit to one
        track or the other. In the meantime please use your best guess at what
        you want to do and will have time for. The better our estimates of
        numbers are, the better the pod allocation process will be.
        Unfortunately, due to the planning involved and the group formation, you
        cannot switch tracks once the school has begun.
      </p>
      <h4>
        Q: Will my application be considered for both tracks or only the track I
        selected?
      </h4>
      <p>
        A: We will consider your application for the track you selected,
        although it is possible to switch before a deadline (to be determined).
      </p>
      <h4>
        Q: Will I still be able to ask questions if I am on an Observer track?
      </h4>
      <p>
        A: In some cases yes. You&apos;ll have access to the lectures and
        curricular materials but you will have no TA or mentor support, and no
        group projects. You may be able to join the live Q&amp;A for lectures
        (details tbd).
      </p>
      <h4>
        Q: What if my Interactive track application is unsuccessful? Will I be
        offered a place on the Observer track?
      </h4>
      <p>A: Yes.</p>
      <h4>
        Q: I only want to do the Observer track, do I still need to provide
        reference letters?
      </h4>
      <p>A: No.</p>
      <h4>
        I want to be an Observer, do I need to complete round 2 of the application
      </h4>
      <p>
        A: No, unless you think you may wish to switch tracks.  If there is any
        chance you may want to switch  tracks you must complete round 2.  If you
        have not completed round 2, by the time the deadline date is reached, you
        will not be able to switch tracks.
      </p>

      <hr />
      <h3 id="neuromatch-academy-student-applications">
        Neuromatch Academy Student Applications
      </h3>
      <h4>Q: Who should be a student?</h4>
      <p>
        A: Anyone who is interested in following a career in neuroscience either
        in academia or in industry. Students should have some background already
        in coding (but we will provide learning resources), although there are
        two different tracks to facilitate a broader range of abilities.
      </p>
      <h4>
        Q: I completed my student application but was not asked to add my email
        address anywhere? How do I know my application was received?
      </h4>
      <p>
        A: We will send a large email blast to everybody who applied to be a
        student or TA welcoming them to participate in Round 2 of the application
        process. If you don&apos;t receive this confirmation email by May 11
        (or latest May 12), please sign up again or contact us at
        {' '}
        <code>neuromatchacademy@neuromatch.io</code>
        . Please make sure to
        include your email address in Round 2.
      </p>
      <h4>
        Q: Can I make changes to my round 2 application before 25 May?
        How do I do this?
      </h4>
      <p>
        A: In order to make changes to your student application you will need
        to resubmit the round 2 form.  The selection committee will use the
        most recent application when making the final student selection.
      </p>
      <h4>
        Q: Do I have to have a Google Scholar account to apply? (I don&apos;t
        have any publications yet)
      </h4>
      <p>
        A: You don&apos;t have to have a Google Scholar account, but if you do,
        sharing it will be helpful for us to evaluate Neuromatch Academys long
        term impact and raise funding for future years. Note that you don&apos;t
        need to have any publications to apply to Neuromatch Academy or to
        create a Google Scholar profile.
      </p>
      <h4>Q: What level of Python experience do I need?</h4>
      <p>
        A:  Students should be comfortable writing simple Python programs at the
        minimum when the course begins. If you have never seen an &quot;if&quot; statement
        before, this probably isn&apos;t for you, but you don&apos;t need to be a super
        expert either. If you have expertise in a comparable language (e.g. R,
        MATLAB, or C), you should commit to taking an introductory course or tutorial
        in Python prior to the start of the course to learn the Python syntax.
        We have a list of prerequisites with materials to help
        you catch up.
        {' '}
        <a
          href="https://github.com/NeuromatchAcademy/precourse"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <h4>Q:What if I&apos;m not a great coder? Can I still join?</h4>
      <p>
        A: You do need to have good programming skills to be able to participate,
        as described above. However, we will have two levels of goals for every
        tutorial&#58; one for beginner/intermediate students and one for
        intermediate/advanced students. This way everybody has reasonable targets
        to fit their ability levels.
      </p>
      <h4>Q: What does it cost to be a student?</h4>
      <p>
        A: We currently expect to charge a small fee for the Interactive track
        for full-time students/academics in order to help pay for TAs. We want
        to make this school accessible to everyone, so we are exploring a tiered
        payment so money does not stop you from attending. The Observer track
        will be free of charge.
      </p>
      <h4>Q: What if I drop out of the academy?</h4>
      <p>
        Dropping out of the academy makes it harder for your pod to work well
        because there will only be a small number of people at the start of the
        academy. You will also not receive your certificate of completion and
        may not be selected to participate in future Neuromatch programs. Of
        course we understand that unforeseen circumstances can arise and will
        accommodate those as needed, but please do plan to stay through to the
        end.
      </p>
      <h4>Q: What if I can&apos;t attend the whole school? </h4>
      <p>
        A: We expect Interactive students to attend 100&#37; of the school.
        Because of the small group structure, a student&apos;s absence will
        negatively impact the experience of their peers as well as their own
        learning. However we understand that some absences are unavoidable and
        students will be able to communicate with their TAs in advance if
        they need to miss any time. Excessive absences will not lead to a
        certificate of completion of the course.
      </p>
      <h4>
        Q: Will extra info be given to unsuccessful candidates about what is
        missing from their application?
      </h4>
      <p>
        A: Unfortunately we will not be able to give personalized feedback to
        applicants.
      </p>
      <hr />
      <h4>
        Q: I missed the 25 May deadline to switch from Interactive to Observer
        Track. Can I still do this and how do I do this?
      </h4>
      <p>
        A: If you applied to be on the Interactive track and now want to be an
        Observer or withdraw your application entirely, please email us
        (
        <code>neuromatchacademy@neuromatch.io</code>
        ) with the subject line &quot;Switch
        to Observer&quot;
        or &quot;Withdraw application&quot;. Please do this as soon as possible so that we
        can allot your spot to someone else.
      </p>
      <h4>
        Q: I forgot to submit my Round 2 Application by midnight 25 May. I still
        want to be considered for the Interactive track.  Is it too late?
      </h4>
      <p>
        A: Yes it is too late. Due to the volumes of applications received and the
        post-application work required to match students for the pods, we are not able
        to accept late applications for the Academy. Follow us on
        {' '}
        <a href="https://twitter.com/neuromatch">
          @neuromatch
        </a>
        {' '}
        on Twitter for updates on possible late Observer applications openings.
      </p>

      <h3 id="ta-applications-selection-and-responsibilities">
        TA Applications, Selection, and Responsibilities
      </h3>
      <h4>Q: Who should be a TA? What do TAs do?</h4>
      <p>
        A: TAs will work closely with a given pod for three weeks to help
        students solve problems and guide group projects. TAs should have
        substantial expertise in Python and experience with some aspects of
        neural data analysis.
      </p>
      <h4>
        Q: I&apos;d like to apply to be a TA but have no neuroscience
        experience, but I&apos;m experienced in Python. Can I still apply?
      </h4>
      <p>
        A: No. Since a central theme of the course is learning how to
        appropriately apply models to neuroscience, TAs should have experience
        with that. But if you can get enough neuroscience background with the
        pre-course resources we provide, you may still be eligible to
        participate as a student in the Interactive track, or you can follow
        along in the Observer track.
      </p>
      <h4>
        Q: I completed my TA application but did not receive any kind of email
        confirmation? How do I know my application was received?
      </h4>
      <p>
        A: We will send a large email blast to everybody who applied to be a TA
        welcoming them to participate in Round 2 of the application process. If
        you don&apos;t receive this confirmation email by May 10, please sign up
        again or contact us at
        <code>neuromatchacademy@neuromatch.io</code>
        . Please make sure to
        include your email address in Round 2.
      </p>
      <h4>
        Q: Can I be a TA in week 1 and then a student in week 2 and 3? Can I be
        a TA and a student?
      </h4>
      <p>
        A: TAs must follow the same group of students through all three weeks.
        Thus the simple answer is no, you can&apos;t be a TA for just a week or
        two. However, we expect to need several backup TAs, so if you cannot
        commit to all three weeks please indicate this in your application and
        we may ask you to be a backup TA!
      </p>
      <h4>
        Q: I&apos;d like to be a TA but it looks to be merit based. Should I
        also apply as a student?
      </h4>
      <p>A: Yes, please do apply both as a TA and a student!</p>
      <h4>Q: How much do TAs get paid?</h4>
      <p>
        A: We are currently aiming to pay TAs in the neighborhood of at least
        $1000 each. This will depend on funding sources, and we are actively
        working to get as much funding as we can to pay compensate TAs appropriately.
        Stay tuned for updates!
      </p>
      <hr />
      <h3 id="being-a-mentor">Being a Mentor</h3>
      <h4>Q: Who should be a Mentor? What do Mentors do?</h4>
      <p>
        A: Mentors can be either academic faculty or industry professionals who
        are interested in networking with students, answering questions related
        to their line of work, and, in some cases, providing support on project
        development
      </p>
      <hr />
      <h3 id="certificates-of-completion-and-course-credit">
        Certificates of completion and course credit
      </h3>
      <h4>Q: Will students receive a certificate of completion?</h4>
      <p>
        A: Yes, we will provide all Interactive track students who complete all
        3 weeks of the Interactive track and associated group projects with a
        certificate of completion. Please note that this certificate cannot
        currently be used for university credit and that we are not an
        officially accredited university or school.
      </p>
      <h4>
        Q: Will you provide any grades so I can get university credit for
        participating?
      </h4>
      <p>
        A: We do not plan to give any standardized grades, but you will receive
        a certificate of completion if you&apos;re on the Interactive track and
        you finish the course, including the group project. This certificate of
        completion does not automatically guarantee any sort of university credit
        (because we are not an officially accredited school), but you might be
        able to talk to your administration about that option. Every school has
        different policies, so you&apos;ll need to take your certificate of completion
        and the curriculum information to your specific institution or school to
        see if this is an option for you&#59; unfortunately we can&apos;t help
        facilitate this process given the number of students and universities
        attended.
      </p>
    </CommonPageStyles>
  </AcademyLayout>
);
