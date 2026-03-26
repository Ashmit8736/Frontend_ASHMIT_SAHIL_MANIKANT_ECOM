import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../layout/Layout'; // Ensure this path is correct
import styles from './PartnerDetails.module.css'; // We will create this CSS module

const PartnerDetails = () => {
    const { role, id } = useParams(); // URL se role aur id nikalenge
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPartnerDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                // Aapka backend public details route
                const response = await axios.get(`http://localhost:3000/api/public/details/${role}/${id}`);
                setPartner(response.data);
            } catch (err) {
                console.error("Error fetching partner details:", err);
                setError("Failed to load partner details.");
            } finally {
                setLoading(false);
            }
        };

        if (role && id) {
            fetchPartnerDetails();
        }
    }, [role, id]); // Jab role ya id change ho, tab dobara fetch karein

    if (loading) {
        return <Layout><div className={styles.container}>Loading partner details...</div></Layout>;
    }

    if (error) {
        return <Layout><div className={styles.container} style={{ color: 'red' }}>{error}</div></Layout>;
    }

    if (!partner) {
        return <Layout><div className={styles.container}>No partner found.</div></Layout>;
    }

    return (
        <Layout>
            <div className={styles.partnerDetailsContainer}>
                <div className={styles.header}>
                    <span className={styles.roleTag}>{partner.role || role}</span>
                    <h1 className={styles.companyName}>{partner.company_name}</h1>
                    <p className={styles.ownerName}>Owned by: {partner.fullname || partner.owner_name}</p>
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <strong>Contact:</strong>
                        <p>{partner.email || partner.organisation_email}</p>
                        <p>{partner.phone || partner.primary_contact_person_phone}</p>
                    </div>

                    <div className={styles.detailItem}>
                        <strong>Location:</strong>
                        <p>{partner.branch_address || partner.warehouse_full_address || partner.city}, {partner.branch_city || partner.city}, {partner.branch_state || partner.state}</p>
                        <p>PIN: {partner.branch_pincode || partner.warehouse_pincode || partner.pincode}</p>
                    </div>

                    {partner.role === 'Seller' && (
                        <>
                            <div className={styles.detailItem}>
                                <strong>Business Category:</strong>
                                <p>{partner.business_category}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Nature of Business:</strong>
                                <p>{partner.nature_of_business}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>GST No:</strong>
                                <p>{partner.gst_no}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Warehouse Capacity:</strong>
                                <p>{partner.warehouse_order_procising_capacity} orders/day</p>
                            </div>
                        </>
                    )}

                    {partner.role === 'Supplier' && (
                        <>
                            <div className={styles.detailItem}>
                                <strong>Products Offered:</strong>
                                <p>{partner.products ? JSON.parse(partner.products).join(', ') : 'N/A'}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>GST No:</strong>
                                <p>{partner.gst_no}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Optional: Add a button to contact the partner */}
                <div className={styles.contactAction}>
                    <button className={styles.contactButton}>Contact {partner.company_name}</button>
                </div>
            </div>
        </Layout>
    );
};

export default PartnerDetails;