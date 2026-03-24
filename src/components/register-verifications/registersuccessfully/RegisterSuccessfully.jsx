import React from "react";
import style from "./RegisterSuccessfully.module.css";
import { HiBadgeCheck } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'

const RegisterSuccessfully = () => {
  const navigate = useNavigate()

  const handelReturnToHome = (e) => {
    e.preventDefault();
    navigate('/')
  }

  return (
    <div className={style.sellerSuccessFullyregister}>
      <header>
        <HiBadgeCheck className={style.icon} />
        <h2>Thank You for Registering!</h2>
      </header>
      <div className={style.paraContainer}>
        <p>
          Your information has been successfully submitted and is currently
          being processed. We appreciate your registration and look forward to
          having you on board.
        </p>
        <p>
          You will receive a confirmation email with further instructions
          shortly. If you have any questions, please do not hesitate to contact
          us.
        </p>
        <p>
          Kindly monitor your email (including the spam folder) for updates. Our team will reach out if any further information is required.
        </p>

        <ul className={style.highlight}>
          Thank you for choosing to partner with us — we look forward to helping
          your business grow and reach more customers.
        </ul>
      </div>
      <div className={style.btn}>
        <button onClick={handelReturnToHome}>Return to Homepage</button>
      </div>
    </div>
  );
};

export default RegisterSuccessfully;
