/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useValidateRegistration from '../../hooks/useValidateRegistration';
import { useAuthenFetchPost } from '../../hooks/useFetch';
// import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import { LineButton } from '../BaseComponents/Buttons';

// -- CONSTANTS
const paymentAmount = 2500;

// TODO: just follow this https://stripe.com/docs/stripe-js#elements

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

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
`;

const LabelInputContainer = styled.div`
  margin-bottom: 35px;

  label {
    font-weight: bold;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid #bbb;
  border-radius: 5px;

  width: 144px;
  height: 38px;
`;

const CheckoutForm = ({ onSuccess, onError, onHideModal }) => {
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  // this isn't used yet
  const [, setError] = useState(null);

  const { currentUserInfo, prevUserData, idToken } = useValidateRegistration();

  const stripe = useStripe();
  const elements = useElements();

  // payment_suggested
  // dont need to send below as backend can get from token in the header
  // name_corrected
  // email_corrected
  const { result: { client_secret: clientSecret } } = useAuthenFetchPost(
    currentUserInfo?.uid ? '/api/create_stripe_payment' : undefined,
    {},
    currentUserInfo?.uid ? {
      payload: {
        amount: paymentAmount,
        // can be omitted, default as USD
        currency: 'USD',
      },
    } : {},
  );

  if (!stripe || !elements) {
    return null;
  }

  const handleSubmit = async () => {
    setConfirmingPayment(true);

    if (prevUserData && clientSecret) {
      stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: prevUserData.fullname,
              email: prevUserData.email,
            },
          },
        },
      ).then((result) => {
        if (result.error) {
          setError(result.error.message);
          setConfirmingPayment(false);
          onError(result.error.message);
        } else {
          setError(null);
          // validate payment on the server
          fetch(
            '/api/set_stripe_payment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                payload: result.paymentIntent,
              }),
            },
          )
            .then((res) => {
              // console.log('set_stripe_payment response:', res);
              if (res.ok) {
                // hide modal
                // show toast and update UI this user is already paid
                onSuccess();
              } else {
                // show toast along with the message from the server
                res.json().then((resJson) => {
                  onError(resJson.message);
                });
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              setConfirmingPayment(false);
            });
        }
      });
    }
  };

  return (
    <StripeCardContainer>
      <div>
        <LabelInputContainer>
          <label htmlFor="card-element">
            Credit or debit card
          </label>
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
            onChange={(event) => {
              if (event.error) {
                setError(event.error.message);
              } else {
                setError(null);
              }
            }}
          />
        </LabelInputContainer>
        <SubmitButtonContainer>
          {confirmingPayment
            ? (
              <SpinnerContainer>
                <Spinner />
              </SpinnerContainer>
            )
            : (
              <>
                <LineButton
                  color="#ff3333"
                  hoverColor="#ff0000"
                  hoverBgColor="#fff"
                  onClick={onHideModal}
                >
                  Cancel
                </LineButton>
                <LineButton
                  color="#00bb00"
                  hoverColor="#33bb33"
                  hoverBgColor="#fff"
                  onClick={handleSubmit}
                >
                  Submit Payment
                </LineButton>
              </>
            )}
        </SubmitButtonContainer>
      </div>
    </StripeCardContainer>
  );
};

CheckoutForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHideModal: PropTypes.func,
};

CheckoutForm.defaultProps = {
  onSuccess: () => {},
  onError: () => {},
  onHideModal: () => {},
};

export default CheckoutForm;
