import React, { useState } from "react";
import style from "./StatusButton.module.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import {ApprovedSeller,RejectSeller} from '../../../../store/actions/SellerAction'
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const StatusButton = ({sellerId}) => {
  const [showApprovedConfirm, setshowApprovedConfirm] = useState(false)
  const [showRejectConfirm, setshowRejectConfirm] = useState(false)

  const dispatch = useDispatch()

  const handeApprovedSeller = () => {
      setshowApprovedConfirm(true)
  }

  const handelCloseApprovedSeller = () => {
    setshowApprovedConfirm(false)
  }

  const handeRejectSeller = () => {
    console.log("hello reject");
    
      setshowRejectConfirm(true)
  }

  const handelCloseRejectSeller = () => {
    setshowRejectConfirm(false)
  }

  const handelSubmitAprovedSeller = () => {
      try {
        dispatch(ApprovedSeller({ sellerId }))
      toast.success("this seller is approved By Admin ADn Email is sended to seller")
        setshowApprovedConfirm(false)
      } catch (error) {
        toast.error(error)
      }
  }

  const handelSubmitRejectSeller = () => {
      try {
        console.log("hello reject");
        
        dispatch(RejectSeller({ sellerId }))
      toast.success("this seller is Reject By Admin ADn Email is sended to seller")
        setshowRejectConfirm(false)
      } catch (error) {
        toast.error(error)
      }
  }

  return (
    <div className={style.StatusButtonContainer}>
      {showApprovedConfirm && <div className={style.confirmAproved}>
          <h3>Are you sure you want to approve this seller?</h3>
          <div className={style.confirmBtns}>
            <button className={style.No} onClick={handelCloseApprovedSeller}><IoMdClose/></button>   
            <button className={style.yes} onClick={handelSubmitAprovedSeller}><FaCheck/></button>
          </div>
      </div>}
      {showRejectConfirm && <div className={style.confirmReject}>
          <h3>Are you sure you want to reject this seller?</h3>
          <div className={style.confirmBtns}>
            <button className={style.No} onClick={handelCloseRejectSeller}><IoMdClose/></button>   
            <button className={style.yes} onClick={handelSubmitRejectSeller}><FaCheck/></button>
          </div>
      </div>}
      <div className={style.buttons}>
        <div className={style.Reject}>
        <button onClick={handeRejectSeller}> <IoCloseCircleOutline className={style.rejectIcon} /><span>reject</span></button>
      </div>
      <div className={style.approved}>
        <button className={style.approvedBtn} onClick={handeApprovedSeller}>
            <FaCheckCircle className={style.approvedIcon} />
            <span>Approve</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default StatusButton;
