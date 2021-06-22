/* eslint-disable react/jsx-one-expression-per-line */
// import PropTypes from 'prop-types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { navigate } from 'gatsby';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { LineButton } from '../components/BaseComponents/Buttons';
// import DarkTheme from '../components/BaseComponents/CommonPageStylesDark';
import LoadingView from '../components/BaseComponents/LoadingView';
import Toast, { toastTypes } from '../components/BaseComponents/Toast';
import Layout from '../components/layout';
import { CheckoutForm, WaivingForm } from '../components/PaymentForm';
import { useAuthenFetchGet } from '../hooks/useFetch';
import useValidateRegistration from '../hooks/useValidateRegistration';

// -- CONSTANTS
// USD
const paymentAmount = 2500;

// -- COMPONENTS
const Modal = styled.div`
  display: ${(p) => (p.visible ? 'flex' : 'none')}; /* Hidden by default */
  flex: 1;
  justify-content: center;
  align-items: center;

  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.45); /* Black w/ opacity */
`;

const ModalContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  max-width: 480px;
  border-radius: 3%;
  padding: 20px;

  -webkit-box-shadow: 2px 2px 10px 0px rgba(25,25,25,0.65);
  -moz-box-shadow: 2px 2px 10px 0px rgba(25,25,25,0.65);
  box-shadow: 2px 2px 10px 0px rgba(25,25,25,0.65);
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 50px;
`;

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  // 'payment' or 'waiving'
  const [modalContent, setModalContent] = useState('');
  const toastRef = useRef(null);

  const { isLoggedIn, idToken, prevUserData } = useValidateRegistration();

  const [statusTrigger, setStatusTrigger] = useState('');
  const { result: paymentResult } = useAuthenFetchGet(`/api/check_payment?${statusTrigger}`);

  const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY);

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You're not logged in yet, please log-in before making a payment. Redirecting to the main page..." />
    );
  }

  if (!idToken) {
    return <LoadingView />;
  }

  return (
    <Elements stripe={stripePromise}>
      <Modal visible={modalVisible}>
        <ModalContentContainer>
          {modalContent === 'payment'
            ? (
              <CheckoutForm
                onSuccess={() => {
                  toastRef.current.show(toastTypes.success, 'Your payment was successful!');
                  setModalVisible(false);
                  setStatusTrigger('paid=true');
                }}
                onError={(errMsg) => {
                  toastRef.current.show(toastTypes.error, errMsg);
                  setModalVisible(false);
                }}
                onHideModal={() => setModalVisible(false)}
              />
            )
            : modalContent === 'waiving'
              ? (
                <WaivingForm
                  onConfirmWaive={() => {
                    fetch(
                      '/api/waive_stripe_payment',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${idToken}`,
                        },
                        body: JSON.stringify({}),
                      },
                    )
                      .then((res) => {
                        if (res.ok) {
                          toastRef.current.show(toastTypes.success, 'You payment has been waived.');
                          setModalVisible(false);
                          setStatusTrigger('waived=true');
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  onCancel={() => setModalVisible(false)}
                />
              )
              : null}
        </ModalContentContainer>
      </Modal>
      <Layout>
        <Toast
          ref={toastRef}
        />
        <h2>Payment</h2>
        {prevUserData?.public === true
          ? (
            <p>
              The conference is open for free to the general public, but if you do feel
              able to contribute 25 USD to help cover our streaming costs and organise future
              events, that would be a great
              help. If not, feel free to just tick the button to waive the fee and no need to
              worry. We are really happy to have you here!
            </p>
          )
          : (
            <p>
              In this neuromatch conference, we are expecting the scale to be much larger,
              so we need to cover streaming costs (none of the organizers are being paid
              for our time). However, it will be free for anyone who cannot pay.
              If you can afford to pay the conference fees, we would encourage
              you to pay us below. Otherwise, please request waiving below if you are not
              from a well-funded lab or a well-funded company. This payment will make our
              conference sustains better in the long run.
            </p>
          )}
        {/* {paymentResult?.payment_status !== 'wait'
          ? paymentResult?.payment_status === 'paid'
            ? (
              <p>
                You already paid
                {` ${paymentAmount / 100} USD `}
                . Thank you for your support
                for neuromatch conference!
              </p>
            )
            : paymentResult?.payment_status === 'waived'
              ? (
                <p>
                  You already waived the payment
                  for neuromatch conference.
                </p>
              )
              : null
          : (
            // if wait for payment, show buttons
            <>
              <SubmitButtonContainer>
                <LineButton
                  color="#222"
                  // hoverColor="#444"
                  hoverBgColor="#fff"
                  onClick={() => {
                    setModalContent('payment');
                    setModalVisible(true);
                  }}
                >
                  {`Pay fee (${paymentAmount / 100} USD)`}
                </LineButton>
                <LineButton
                  color="#222"
                  hoverColor="#444"
                  hoverBgColor="#fff"
                  onClick={() => {
                    setModalContent('waiving');
                    setModalVisible(true);
                  }}
                >
                  Request waiving
                </LineButton>
              </SubmitButtonContainer>
            </>
          )} */}
      </Layout>
    </Elements>
  );
};
