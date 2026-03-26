import React, { useEffect, useState } from "react";
import style from "./SellerRegisterReques.module.css";
import { LuEye } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import SellerVeifyPopup from "../sellerVerifyPopup/SellerVeifyPopup";
import { useDispatch, useSelector } from "react-redux";
import {getAllSeller} from '../../../store/actions/SellerAction'
const SellerRegisterRequest = () => {

 const dispatch =  useDispatch()
 const {allSellers} = useSelector(state=> state.seller)
 const [sellerId, setsellerId] = useState(null)
 const [isPopupOpen, setisPopupOpen] = useState(false)
;

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

const openSellerVErifyPopup = (id) => {
    setsellerId(id)
    setisPopupOpen(true)
}

const closeSellerVerifyPopup =() =>{
  setisPopupOpen(false);
  setsellerId(null)
}


useEffect(() => {
 dispatch(getAllSeller({page:1,limit:10}))
}, [dispatch])




  const renderSellerRegisterRequest = () => {
    return allSellers.map((seller) => (
      <tr key={seller.id}>
        <td>
          <span className={style.link}>{seller.id}</span>
        </td>
        <td>
          <div className={style.company_name}>{seller.company_name}</div>
          <div className={style.owner_name}>{seller.owner_name}</div>
        </td>
        <td>{seller.gst_no}</td>
        <td>
          <div>{seller.owner_email}</div>
          <div>{seller.owner_phone}</div>
        </td>
        <td>{new Date(seller.created_at).toLocaleString('en-IN')}</td>
        <td>
          <span className={`${style.status} ${getStatusClass(seller.approval_status)}`}>
            {seller.approval_status}
          </span>
        </td>
        <td>
          <button onClick={() => openSellerVErifyPopup(seller.id)} className={style.viewButton}><MdOutlineRemoveRedEye />View Details</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className={style.SellerRegisterRequestContainer}>
      <header className={style.RegisterRequesHeader}>
        <h2>Seller Registration Requests</h2>
        <select className={style.Status}>
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="reject">Reject</option>
        </select>
      </header>
      <div className={style.sellerList}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Company name</th>
              <th>GST Number</th>
              <th>Contact </th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderSellerRegisterRequest()}</tbody>
        </table>
      </div>
       {isPopupOpen && (
        <div className={style.overlay}><SellerVeifyPopup onClose={closeSellerVerifyPopup} sellerId={sellerId}/></div>
       )}
    </div>
  );
};

export default SellerRegisterRequest;
