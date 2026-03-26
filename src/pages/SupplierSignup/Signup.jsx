

import { useState, useEffect } from "react";
import { MdOutlineManageAccounts } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import { CiBank } from "react-icons/ci";
import { LuWarehouse } from "react-icons/lu";

import Step1_CreateAccount from "../../pages/SupplierSignup/SupplierRegister/Step1_CreateAccount";
import Step2_BusinessDetails from "../../pages/SupplierSignup/SupplierRegister/Step2_BusinessDetails";
import Step3_ProductDetails from "../../pages/SupplierSignup/SupplierRegister/Step3_ProductDetails";
import Step4_GSTDetails from "../../pages/SupplierSignup/SupplierRegister/Step4_GSTDetails";
import Congrats from "../../pages/SupplierSignup/SupplierRegister/Congrats";


import styles from "../../pages/SupplierSignup/SupplierRegister/Signup.module.css";

export default function Signup() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({});

  const STORAGE_KEY = "supplier_signup_draft";

  const steps = [
    { icon: <MdOutlineManageAccounts />, name: "Account Setup" },
    { icon: <SiGoogledocs />, name: "Business Details" },
    { icon: <CiBank />, name: "Products" },
    { icon: <LuWarehouse />, name: "GST & Compliance" },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps + 1));

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setStep(
        parsed.step && parsed.step <= totalSteps
          ? parsed.step
          : 1
      );

      setFormData(parsed.formData || {});
    }
  }, []);
  useEffect(() => {
    const safeFormData = { ...formData };

    // 🔐 password ko storage se hatao
    delete safeFormData.password;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        formData: safeFormData,
      })
    );
  }, [step, formData]);


  return (
    <div className={styles.registerMainContainer}>
      <div className={styles.registerInnerContainer}>

        {/* HEADER */}
        <header className={styles.heading}>
          <h2>Supplier Verification Process</h2>
          <p>Complete all steps to become a verified supplier</p>
        </header>

        {/* STEP CONTENT */}
        {step === 1 && (
          <Step1_CreateAccount
            next={nextStep}
            updateData={updateData}
            formData={formData}
          />
        )}

        {step === 2 && (
          <Step2_BusinessDetails
            next={nextStep}
            prev={prevStep}
            updateData={updateData}
            formData={formData}
          />
        )}

        {step === 3 && (
          <Step3_ProductDetails
            next={nextStep}
            prev={prevStep}
            updateData={updateData}
            formData={formData}
          />
        )}

        {step === 4 && (
          <Step4_GSTDetails
            prev={prevStep}
            formData={formData}
            updateData={updateData}
          />
        )}

        {step === 5 && <Congrats formData={formData} />}

        <hr className={styles.divider} />
      </div>
    </div>
  );

}
