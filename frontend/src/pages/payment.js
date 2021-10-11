/* eslint-disable react/jsx-one-expression-per-line */
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { navigate } from "gatsby"
import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import {
  ButtonsContainer,
  LineButton,
} from "../components/BaseComponents/Buttons"
import LoadingView from "../components/BaseComponents/LoadingView"
import Toast, { toastTypes } from "../components/BaseComponents/Toast"
import Layout from "../components/layout"
import { CheckoutForm, WaivingForm } from "../components/PaymentForm"
import useAPI from "../hooks/useAPI"
import useFirebaseWrapper from "../hooks/useFirebaseWrapper"
import useValidateRegistration from "../hooks/useValidateRegistration"

// -- COMPONENTS
const Modal = styled.div`
  display: ${p => (p.visible ? "flex" : "none")}; /* Hidden by default */
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
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.45); /* Black w/ opacity */
`

const ModalContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  /* color: ${p => p.theme.colors.black}; */
  background-color: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.secondary};
  max-width: 480px;
  border-radius: 4px;
  padding: 20px;

  -webkit-box-shadow: 2px 2px 10px 0px ${p => p.theme.colors.secondary};
  -moz-box-shadow: 2px 2px 10px 0px ${p => p.theme.colors.secondary};
  box-shadow: 2px 2px 10px 0px ${p => p.theme.colors.secondary};
`

export default () => {
  const toastRef = useRef(null)
  const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

  const { payment: paymentAPI } = useAPI()
  const { prevUserData } = useValidateRegistration()
  const { isLoggedIn } = useFirebaseWrapper()

  // local states
  const [paymentStatus, setPaymentStatus] = useState()
  const [clientSecret, setClientSecret] = useState()
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(1500)
  const [modalVisible, setModalVisible] = useState(false)
  // 'payment' or 'waiving'
  const [modalContent, setModalContent] = useState("")

  // check payment status
  useEffect(() => {
    const responsePromise = paymentAPI({
      option: "check",
      payload: { amount: "1500", currency: "USD" },
    })

    if (!responsePromise) {
      return
    }

    responsePromise
      .then(res => res.json())
      .then(resJson => setPaymentStatus(resJson.payment_status))
      .catch(err => console.log("[paymentAPI]", err))
  }, [paymentAPI])

  // if not paid yet, get client secret for confirmation on payment
  useEffect(() => {
    if (paymentStatus === "wait") {
      const responsePromise = paymentAPI({
        option: "create",
        payload: { amount: paymentAmount, currency: "USD" },
      })

      if (!responsePromise) {
        return
      }

      responsePromise
        .then(res => res.json())
        .then(resJson => setClientSecret(resJson.client_secret))
        .catch(err => console.log("[paymentAPI]", err))
    }
  }, [paymentAPI, paymentAmount, paymentStatus])

  // if not login redirect
  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate("/")
    }, 2500)

    return (
      <LoadingView message="You're not logged in yet, please log-in before making a payment. Redirecting to the main page..." />
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <Modal visible={modalVisible}>
        <ModalContentContainer>
          {modalContent === "payment" ? (
            <CheckoutForm
              isConfirmingPayment={isConfirmingPayment}
              onSubmit={(stripe, elements, CardElement) => {
                setIsConfirmingPayment(true)

                stripe
                  .confirmCardPayment(clientSecret, {
                    payment_method: {
                      card: elements.getElement(CardElement),
                      billing_details: {
                        name: prevUserData.fullname,
                        email: prevUserData.email,
                      },
                    },
                  })
                  .then(result => {
                    if (result.error) {
                      console.log("[stripe.confirmCardPayment]", result.error)
                    } else {
                      paymentAPI({
                        option: "set",
                        payload: {
                          client_secret: clientSecret,
                          amount: paymentAmount,
                          currency: "USD",
                        },
                      })
                        .then(res => {
                          if (res.ok) {
                            setPaymentStatus("paid")
                          }

                          return res.json()
                        })
                        .then(resJson => {
                          console.log("resJson", resJson)

                          toastRef.current.show(
                            resJson.error
                              ? toastTypes.error
                              : toastTypes.success,
                            resJson.message
                          )
                        })
                        .catch(err => {
                          console.log("[paymentAPI/set]", err)
                        })
                        .finally(() => {
                          setModalVisible(false)
                          // setIsConfirmingPayment(false)
                        })
                    }
                  })
                  .catch(err => {
                    console.log("[stripe.confirmCardPayment]", err)
                  })
                  .finally(() => {
                    // setIsConfirmingPayment(false)
                  })
              }}
              onHideModal={() => setModalVisible(false)}
            />
          ) : modalContent === "waiving" ? (
            <WaivingForm
              isConfirmingWaiving={isConfirmingPayment}
              onConfirmWaive={() => {
                setIsConfirmingPayment(true)

                paymentAPI({
                  option: "waive",
                  payload: {
                    client_secret: clientSecret,
                    amount: paymentAmount,
                    currency: "USD",
                  },
                })
                  .then(res => {
                    if (res.ok) {
                      setPaymentStatus("waived")
                    }

                    return res.json()
                  })
                  .then(resJson => {
                    toastRef.current.show(toastTypes.success, resJson.message)
                  })
                  .catch(err => {
                    console.log("[paymentAPI/waive]", err)
                  })
                  .finally(() => {
                    setModalVisible(false)
                    setIsConfirmingPayment(false)
                  })
              }}
              onCancel={() => setModalVisible(false)}
            />
          ) : null}
        </ModalContentContainer>
      </Modal>
      <Layout>
        <Toast ref={toastRef} />
        <h2>Payment</h2>
        {prevUserData?.public === true ? (
          <p>
            This is displayed for non-neuroscientist audience.
            We use Stripe to gather the payment at the conference.
          </p>
        ) : (
          <p>
            We use Stripe to collect payment at our conference.
            At Neuromatch Conference, we need to cover streaming costs and tech
            infrastructure such as our server. None of the organizers are being
            paid for our time. However, it will be free for anyone who cannot
            pay. If you can afford to pay the conference fees, we would
            encourage you to pay us below. Otherwise, please request waiving
            below if you are not from a well-funded lab or a well-funded
            company. This payment will make our conference sustains better in
            the long run.
          </p>
        )}
        {paymentStatus !== "wait" ? (
          paymentStatus === "paid" ? (
            <p>
              You already paid
              {` ${paymentAmount / 100} USD`}. Thank you for your support for
              Neuromatch Conference!
            </p>
          ) : paymentStatus === "waived" ? (
            <p>You already waived the payment for Neuromatch Conference.</p>
          ) : null
        ) : (
          // if wait for payment, show buttons
          <>
            <ButtonsContainer>
              <LineButton
                onClick={() => {
                  setModalContent("payment")
                  setModalVisible(true)
                }}
              >
                {`Pay fee (${paymentAmount / 100} USD)`}
              </LineButton>
              <LineButton
                onClick={() => {
                  setModalContent("waiving")
                  setModalVisible(true)
                }}
              >
                Request waiving
              </LineButton>
            </ButtonsContainer>
          </>
        )}
      </Layout>
    </Elements>
  )
}
