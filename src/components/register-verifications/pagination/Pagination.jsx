




import { useDispatch, useSelector } from "react-redux";
import style from "./Pagination.module.css";
import {
  nextRegistraionStep,
  prevRegstraionStep,
  setRegistrationError,
} from "../../../store/slices/Seller.slice";
import { toast } from "react-toastify";
import { sellerRegistration } from "../../../store/actions/SellerAction";
import { useNavigate } from "react-router-dom";

const Pagination = ({ totalSteps }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isInvalid = (v) =>
    v === null ||
    v === undefined ||
    v.toString().trim() === "";


  const {
    registration: { currentStep, sellerData, stepValid },
    loading,
  } = useSelector((state) => state.seller);

  /* 🔥 IMPORTANT: sab required fields destructure karo */
  const {
    fullname,
    phone,

    email,
    password,

    // STEP 2
    gst_no,
    organisation_email,
    company_name,

    primary_contact_person_name,
    primary_contact_person_phone,
    primary_contact_person_email,


    owner_name,
    owner_email,
    owner_phone,

    nature_of_business,
    business_category,

    // STEP 3
    bank_account_holder_name,
    pan_number,
    bank_account_no,
    bank_IFCS,
    bank_name,
    account_type,

    branch_name,
    branch_address,
    branch_city,
    branch_state,
    branch_pincode,

    // STEP 4
    warehouse_pincode,
    warehouse_state,
    warehouse_full_address,
    warehouse_order_procising_capacity,

    // VERIFICATION FLAGS
    verifyPhone,
    verifyEmail,
  } = sellerData;

  /* ================== NEXT ================== */
  const increasePage = () => {
    let errors = {};

    /* -------- STEP 1 -------- */
    if (currentStep === 1) {
      if (!verifyPhone)
        errors.phone = "Phone verification required";

      if (!verifyEmail)
        errors.email = "Email verification required";

      if (!password || password.length < 8)
        errors.password = "Password must be at least 8 characters";
    }

    /* -------- STEP 2 -------- */
    if (currentStep === 2) {
      if (isInvalid(gst_no))
        errors.gst_no = "GST number required";


      if (isInvalid(organisation_email) || !organisation_email.includes("@"))
        errors.organisation_email = "Valid organisation email required";


      if (isInvalid(company_name))
        errors.company_name = "Company name required";



      if (isInvalid(owner_name))
        errors.owner_name = "Owner name required";



      if (isInvalid(owner_email) || !owner_email.includes("@"))
        errors.owner_email = "Valid owner email required";



      if (isInvalid(owner_phone) || owner_phone.length !== 10)
        errors.owner_phone = "Valid owner phone required";
    }



    if (currentStep === 3) {
      if (isInvalid(bank_account_holder_name))
        errors.bank_account_holder_name = "Account holder name required";

      if (isInvalid(pan_number))
        errors.pan_number = "PAN number required";

      if (isInvalid(bank_account_no))
        errors.bank_account_no = "Account number required";

      if (isInvalid(bank_IFCS))
        errors.bank_IFCS = "IFSC code required";

      if (isInvalid(bank_name))
        errors.bank_name = "Bank name required";

      if (isInvalid(account_type))
        errors.account_type = "Account type required";

      if (isInvalid(branch_name))
        errors.branch_name = "Branch name required";

      if (isInvalid(branch_address))
        errors.branch_address = "Branch address required";

      if (isInvalid(branch_city))
        errors.branch_city = "Branch city required";

      if (isInvalid(branch_state))
        errors.branch_state = "Branch state required";

      if (isInvalid(branch_pincode))
        errors.branch_pincode = "Branch pincode required";

    }

    /* -------- STEP 4 -------- */
    if (currentStep === 4) {
      if (isInvalid(warehouse_pincode))
        errors.warehouse_pincode = "Warehouse pincode required";

      if (isInvalid(warehouse_state))
        errors.warehouse_state = "Warehouse state required";

      if (isInvalid(warehouse_order_procising_capacity))
        errors.warehouse_order_procising_capacity =
          "Storage capacity required";

      if (isInvalid(warehouse_full_address))
        errors.warehouse_full_address = "Warehouse address required";
    }

    /* ❌ ERRORS FOUND */
    if (Object.keys(errors).length > 0) {
      dispatch(setRegistrationError(errors));
      toast.error("Please fix highlighted fields");
      return;
    }

    /* ✅ ALL GOOD */
    dispatch(setRegistrationError({}));
    dispatch(nextRegistraionStep());
  };

  /* ================== BACK ================== */
  const decreasePage = () => {
    if (currentStep > 1) {
      dispatch(prevRegstraionStep());
    }
  };

  /* ================== SUBMIT ================== */
  const finalRegsiterSubmition = async () => {
    if (loading) return;

    try {
      // const payload = {
      //   ...sellerData,

      //   // 🔥 normalize
      //   phone: phone.replace(/\D/g, ""),
      //   email: email.trim().toLowerCase(),

      //   declaration: true,
      // };

      // const payload = {
      //   phone: phone.replace(/\D/g, ""),
      //   email: email.trim().toLowerCase(),
      //   password,

      //   gst_no,
      //   organisation_email,
      //   company_name,
      //   owner_name,
      //   owner_email,
      //   owner_phone,

      //   bank_account_holder_name,
      //   pan_number,
      //   bank_account_no,
      //   bank_IFCS,
      //   bank_name,
      //   account_type,

      //   warehouse_pincode,
      //   warehouse_state,
      //   warehouse_full_address,
      //   warehouse_order_procising_capacity,

      //   declaration: true,
      // };

      const payload = {
        // fullname,
        phone,
        email,
        fullname,
        password,

        gst_no,
        organisation_email,

        company_name,

        primary_contact_person_name,
        primary_contact_person_phone,
        primary_contact_person_email,

        owner_name,
        owner_email,
        owner_phone,

        nature_of_business,
        business_category,


        branch_name,
        branch_address,
        branch_city,
        branch_state,
        branch_pincode,

        warehouse_pincode,
        warehouse_state,
        warehouse_full_address,
        warehouse_order_procising_capacity,

        bank_account_holder_name,
        pan_number,
        bank_account_no,
        bank_IFCS,
        bank_name,

        account_type,
        // nature_of_business,
        // business_category,

        declaration: 1,
      };



      const res = await dispatch(sellerRegistration(payload)).unwrap();

      toast.success(
        res.message || "Seller registered successfully. Pending approval."
      );
      localStorage.removeItem("seller_signup_step1");
      localStorage.removeItem("seller_signup_step2");
      localStorage.removeItem("seller_signup_step3");
      localStorage.removeItem("seller_signup_step4");

      navigate("/seller/auth/account-pending", { replace: true });

    } catch (error) {
      // 🔥 backend validation
      if (error?.type === "validation" && error?.errors) {
        dispatch(setRegistrationError(error.errors));
        toast.error("Please fix highlighted fields");
        return;
      }

      toast.error(
        error?.message || "Registration failed. Please check details."
      );
    }
  };

  return (
    <div className={style.pageContainer}>
      <span>
        Step {currentStep} of {totalSteps}
      </span>

      <div className={style.ButtonSection}>
        <button onClick={decreasePage} disabled={currentStep === 1}>
          Back
        </button>

        {/* {currentStep < totalSteps ? (
          <button onClick={increasePage}>Continue</button>
          ) : (
          <button
            onClick={finalRegsiterSubmition}
            disabled={loading}
            className={style.submitButton}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )} */}
        {currentStep < totalSteps ? (
          <button
            onClick={increasePage}
            disabled={
              (currentStep === 1 && !stepValid.account) ||
              (currentStep === 2 && !stepValid.business) ||
              (currentStep === 3 && !stepValid.banking) ||
              (currentStep === 4 && !stepValid.warehouse)
            }
          >
            Continue
          </button>
        ) : (
          <button
            onClick={finalRegsiterSubmition}
            disabled={loading}
            className={style.submitButton}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
