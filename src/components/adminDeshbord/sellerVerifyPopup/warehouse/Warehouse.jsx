import React, { useEffect } from "react";
import style from "./Warehouse.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSeller } from "../../../../store/actions/SellerAction";
import { PiWarehouse } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
const Warehouse = ({ sellerId }) => {
  const { singleSeller, loading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  useEffect(() => {
    if (sellerId) dispatch(getSingleSeller({ sellerId }));
  }, [dispatch, sellerId]);

  if (loading || !singleSeller || Object.keys(singleSeller).length === 0) {
    return <p className={style.loadingText}>Loading seller info...</p>;
  }

  const {
    warehouse_full_address,
    warehouse_order_procising_capacity,
    warehouse_pincode,
    warehouse_state,
  } = singleSeller;

  const renderWarehouseDetails = () => {
    return (
      <section className={style.warehouseDetails}>
        <div className={style.gridInfo}>
          <div>
            <h4>Storage Capacity</h4>
            <p>{warehouse_order_procising_capacity}</p>
          </div>
          <div>
            <h4>Warehouse Pincode</h4>
            <p>{warehouse_pincode}</p>
          </div>
          <div>
            <h4>Warehouse State</h4>
            <p>{warehouse_state}</p>
          </div>
        </div>
        <div className={style.address}>
          <h4>
            <IoLocationOutline />
            Address
          </h4>
          <p>{warehouse_full_address}</p>
        </div>
      </section>
    );
  };

  return (
    <div className={style.WarehouseContainer}>
      <header className={style.heading}>
        <PiWarehouse />
        <h3>Warehouse & Storage Information</h3>
      </header>
      {renderWarehouseDetails()}
    </div>
  );
};

export default Warehouse;
