import React, { useEffect } from "react";
import style from "./Banking.module.css";
import { CiBank } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSeller } from "../../../../store/actions/SellerAction";
import { RiAlertFill } from "react-icons/ri";
const Banking = ({ sellerId }) => {
  const { singleSeller, loading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sellerId) dispatch(getSingleSeller({ sellerId }));
  }, [dispatch, sellerId]);

  if (loading || !singleSeller || Object.keys(singleSeller).length === 0) {
    return <p className={style.loadingText}>Loading seller info...</p>;
  }

  const {
    bank_account_holder_name,
    pan_number,
    bank_name,
    branch_name,
    bank_account_no,
    bank_IFCS,
  } = singleSeller;

  const renderBankingDetails = () => {
    return (
      <section className={style.BankingDetails}>
        <div className={style.gridInfo}>
          <div>
            <h4>Account Holder Name</h4>
            <p>{bank_account_holder_name}</p>
          </div>
          <div>
            <h4>PAN number</h4>
            <p>{pan_number}</p>
          </div>
          <div>
            <h4>Bank Name</h4>
            <p>{bank_name}</p>
          </div>
          <div>
            <h4>Branch Name</h4>
            <p>{branch_name}</p>
          </div>
          <div>
            <h4>Account Number</h4>
            <p>{bank_account_no}</p>
          </div>
          <div>
            <h4>IFSC Code</h4>
            <p>{bank_IFCS}</p>
          </div>
        </div>
        <div className={style.alert}>
          <RiAlertFill className={style.icon}/>
          <h4>Verify all banking details carefully before approval</h4>
        </div>
      </section>
    );
  };

  return (
    <div className={style.BankingContainer}>
      <header className={style.heading}>
        <CiBank />
        <h3>Banking Information</h3>
      </header>
      {renderBankingDetails()}
    </div>
  );
};

export default Banking;
