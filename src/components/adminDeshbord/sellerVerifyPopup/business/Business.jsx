import React, { useEffect } from "react";
import style from "./Business.module.css";
import { IoBusinessOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSeller } from "../../../../store/actions/SellerAction";
const Business = ({ sellerId }) => {
  const { singleSeller, loading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sellerId) dispatch(getSingleSeller({ sellerId }));
  }, [dispatch, sellerId]);

  if (loading || !singleSeller || Object.keys(singleSeller).length === 0) {
    return <p className={style.loadingText}>Loading seller info...</p>;
  }

  const {
    company_name,
    nature_of_business,
    gst_no,
    organisation_email,
    primary_contact_person_email,
    primary_contact_person_name,
    primary_contact_person_phone,
  } = singleSeller;

  const renderBusinessDetails = () => {
    return (
      <section className={style.BusinessDetails}>
        <div className={style.gridInfo}>
          <div>
            <h4>Company name</h4>
            <p>{company_name}</p>
          </div>
          <div>
            <h4>Business Types</h4>
            <p>{nature_of_business}</p>
          </div>
          <div>
            <h4>GST Number</h4>
            <p>{gst_no}</p>
          </div>
          <div>
            <h4>Organisation Email</h4>
            <p>{organisation_email}</p>
          </div>
        </div>
          <hr />
        <h2>Primary Contact Person</h2>
        <div className={style.gridInfo}>
          <div>
            <h4>Name</h4>
            <p>{primary_contact_person_name}</p>
        </div>
          <div>
            <h4>Phone</h4>
            <p>{primary_contact_person_phone}</p>
        </div>
          <div>
            <h4>Email</h4>
            <p>{primary_contact_person_email}</p>
        </div>
        </div>
        <div className={style.documents}>
            <h4>Documents uploaded and verified</h4>
            <div className={style.docsTags}>
                <span>GST Certificate</span>
            </div>
        </div>
      </section>
    );
  };

  return (
    <div className={style.BusinessContainer}>
      <header className={style.heading}>
        <IoBusinessOutline />
        <h3>Business & Legal Information</h3>
      </header>
      {renderBusinessDetails()}
    </div>
  );
};

export default Business;
