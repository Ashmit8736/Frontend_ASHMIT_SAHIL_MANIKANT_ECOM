import React, { useEffect } from "react";
import style from "./AccountVerification.module.css";
import { MdManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSeller } from "../../../../store/actions/SellerAction";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";

const AccountVerification = ({ sellerId }) => {

  const { singleSeller,loading } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  
  useEffect(() => {
    if (sellerId) dispatch(getSingleSeller({ sellerId }));
  }, [dispatch, sellerId]);

  if (loading || !singleSeller || Object.keys(singleSeller).length === 0) {
    return <p className={style.loadingText}>Loading seller info...</p>;
  }

  // ✅ Destructure fields to make JSX cleaner
  const {
    company_name,
    owner_email,
    owner_phone,
    created_at,
  } = singleSeller;


  const renderAccountInfo = () => {
    return (
      <div className={style.AccountContainer}>
        <section className={style.left}>
          <div className={style.Content}>
            <h4>Company Name</h4>
            <p>{company_name}</p>
          </div >
          <div className={style.bottomContent}>
            <h4><MdOutlineMailOutline />Owner Email Address</h4>
            <p>{owner_email}</p>
          </div>
        </section>
        <section className={style.right}>
           <div className={style.Content}>
             <h4>Submitted Date</h4>
            <p>{new Date(created_at).toLocaleString('en-IN')}</p>
           </div >
           <div className={style.bottomContent}>
            <h4><LuPhone />Phone Number</h4>
            <p>+91 {owner_phone}</p>
           </div>
        </section>
      </div>
    );
  };

  return (
    <div className={style.AccountVerificationContainer}>
      <div className={style.AccountVerificationHeading}>
        <MdManageAccounts className={style.icon} />
        <h3>Account Information</h3>
      </div>
      {renderAccountInfo()}
    </div>
  );
};

export default AccountVerification;
