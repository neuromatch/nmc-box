import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { LineButton } from "../BaseComponents/Buttons"
import { Container } from "../BaseComponents/container"

const Banner = styled.div`
  height: auto;
  width: 100vw;

  background-color: ${p => p.theme.colors.primary};

  position: fixed;
  bottom: 0;
  left: 0;

  border: 0px solid ${p => p.theme.colors.accent};
  border-top-width: 3px;
  z-index: 9999;
`

const Text = styled.p`
  margin: 0;
  padding: 0;

  font-size: 0.85em;
  margin-bottom: 0.75em;
`

const ButtonsBlock = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 1.25em;
`

const Button = styled(LineButton)`
  font-size: 0.85em;
  /* middle space */
  margin-left: 25px;
`

const StyledLink = styled(Link)`
  padding: 3px 0;
  font-size: 0.85em;
  /* middle space */
  margin-right: 25px;
`

// declare key name here
const acceptCookieKey = "accepted_cookie"

// define a function to get cookie value
// this returns null
const didUserAccept = key => {
  const allCookies = document.cookie
  const target = allCookies.split(";").find(cPair => cPair.includes(key))

  if (target) {
    return target.split("=")[1] === "true"
  }

  return undefined
}

// -- COMPONENT
const CookieBanner = () => {
  const [visible, setVisible] = useState(false)
  const [hadAccepted, setHadAccepted] = useState(true)

  // check if user had accepted?
  useEffect(() => {
    const timer = setTimeout(() => {
      // if user hadn't accepted, display banner
      if (!didUserAccept(acceptCookieKey)) {
        setHadAccepted(false)
        setVisible(true)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [hadAccepted])

  const handleAccept = () => {
    setVisible(false)
    setHadAccepted(true)
    // set cookie, expire in a year
    document.cookie = `${acceptCookieKey}=true;expires=31536000`
  }

  if (!visible) {
    return null
  }

  return (
    <Banner>
      <Container padBottom>
        <Text>
          This website or its third-party tools process personal data (e.g.
          log-in data or IP addresses) and use cookies or other identifiers,
          which are necessary for its functioning and required to achieve the
          purposes illustrated in the cookie policy.
        </Text>
        <Text>
          You accept the use of cookies or other identifiers by closing or
          dismissing this notice, by clicking a link or button or by continuing
          to browse otherwise.
        </Text>
        <ButtonsBlock>
          <StyledLink to="/cookie">Learn more</StyledLink>
          <Button onClick={() => handleAccept()}>Accept</Button>
        </ButtonsBlock>
      </Container>
    </Banner>
  )
}

export default CookieBanner
