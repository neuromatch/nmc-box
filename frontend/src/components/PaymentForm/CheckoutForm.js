/* eslint-disable jsx-a11y/label-has-associated-control */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import PropTypes from "prop-types"
import React, { useState } from "react"
import styled from "styled-components"
import { LineButton } from "../BaseComponents/Buttons"
import LoadingView from "../BaseComponents/LoadingView"
import { Spinner, SpinnerContainer } from "./SpinnerComponents"

// -- CONSTANTS
/**
 * @see https://stripe.com/docs/stripe-js#elements
 */
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
}

const StripeCardContainer = styled.div`
  /**
  * The CSS shown here will not be introduced in the Quickstart guide, but shows
  * how you can use CSS to style your Element's container.
  */
  .StripeElement {
    box-sizing: border-box;

    width: 410px;
    height: 40px;

    padding: 10px 12px;

    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;

    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }

  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  .StripeElement--invalid {
    border-color: #fa755a;
  }

  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
`

const LabelInputContainer = styled.div`
  margin-bottom: 35px;

  label {
    font-weight: bold;
  }
`

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckoutForm = ({ onSubmit, onHideModal, isConfirmingPayment }) => {
  // this isn't used yet
  const [, setError] = useState(null)

  const stripe = useStripe()
  const elements = useElements()

  if (!elements || !stripe) {
    return <LoadingView />
  }

  return (
    <StripeCardContainer>
      <div>
        <LabelInputContainer>
          <label htmlFor="card-element">Credit or debit card</label>
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
            onChange={event => {
              if (event.error) {
                setError(event.error.message)
                console.log("[CardElement/card-element]", event.error)
              } else {
                setError(null)
              }
            }}
          />
        </LabelInputContainer>
        <SubmitButtonContainer>
          {isConfirmingPayment ? (
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
          ) : (
            <>
              <LineButton
                color="#00bb00"
                hoverColor="#33bb33"
                hoverBgColor="#fff"
                onClick={() => onSubmit(stripe, elements, CardElement)}
              >
                Submit Payment
              </LineButton>
              <LineButton
                color="#ff3333"
                hoverColor="#ff0000"
                hoverBgColor="#fff"
                onClick={onHideModal}
              >
                Cancel
              </LineButton>
            </>
          )}
        </SubmitButtonContainer>
      </div>
    </StripeCardContainer>
  )
}

CheckoutForm.propTypes = {
  onSubmit: PropTypes.func,
  onHideModal: PropTypes.func,
  isConfirmingPayment: PropTypes.bool,
}

CheckoutForm.defaultProps = {
  onSubmit: () => {},
  onHideModal: () => {},
  isConfirmingPayment: false,
}

export default CheckoutForm
