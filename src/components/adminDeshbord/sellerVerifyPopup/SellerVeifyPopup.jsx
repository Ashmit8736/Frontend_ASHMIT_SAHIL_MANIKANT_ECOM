import React, { useEffect, useState } from 'react'
import style from "./SellerVerifyPopup.module.css"
import { RiCloseLine } from "react-icons/ri";
import TraclNavbar from './TrackNavbar/TraclNavbar';
import AccountVerification from './AccountVerification/AccountVerification';
import StatusButton from './statusbutton/StatusButton';
import Business from './business/Business';
import Banking from './banking/Banking';
import Warehouse from './warehouse/Warehouse';
import { useSelector } from 'react-redux';

const SellerVeifyPopup = ({sellerId,onClose}) => {

        const [isActiveStatus, setisActiveStatus] = useState(0)
        const {singleSeller} = useSelector(state => state.seller)
        const [approvedStatus, setapprovedStatus] = useState()

        useEffect(() => {
        if(singleSeller){
            const {approval_status} = singleSeller
            setapprovedStatus(approval_status)
        }
        }, [singleSeller])
        
        
    const getStatusClass = (status) => {
      switch (status) {
        case "pending":
          return style.pending;
        case "approved":
          return style.approved;
        case "rejected":
          return style.rejected;
        default:
          return "";
      }
    };

    const lastActive = 3


  return (
    <div className={style.overlay}>
        <div className={style.SellerVeifyPopupContainer}>
        <header className={style.SellerVeifyPopupHeading}>
            <div className={style.Sellerheading}>
                <h2>Seller Verification Request</h2>
                <p>Request ID:
                    <span>t3yq4uihueu</span>
                </p>
            </div>
            <div className={style.crossSection}>
                <RiCloseLine onClick={onClose} className={style.CrossIcon} />
                <p className={`${style.status} ${getStatusClass(approvedStatus)}`}>{approvedStatus}</p>
            </div>
        </header>
        <TraclNavbar isActiveStatus={isActiveStatus} lastActive={lastActive} setisActiveStatus={setisActiveStatus}/>
        {isActiveStatus === 0 && <AccountVerification sellerId={sellerId}/>}
        {isActiveStatus === 1 && <Business sellerId={sellerId}/>}
        {isActiveStatus === 2 && <Banking sellerId={sellerId}/>}
        {isActiveStatus === lastActive &&  <Warehouse sellerId={sellerId}/>} 
        {approvedStatus === "approved" || approvedStatus === "rejected" ? "" : <StatusButton sellerId={sellerId} />}     
        
    </div>
    </div>
  )
}

export default SellerVeifyPopup