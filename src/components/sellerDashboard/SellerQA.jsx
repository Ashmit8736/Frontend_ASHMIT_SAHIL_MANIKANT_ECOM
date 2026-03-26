import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SellerQA.module.css";

const API_BASE = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 5;

export default function SellerQA() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const token = localStorage.getItem("sellerToken");

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/product/qa/seller/questions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("QA FETCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAnswer = async (question_id) => {
        const answer = answers[question_id];
        if (!answer?.trim()) return alert("Please enter answer!");

        try {
            await axios.post(
                `${API_BASE}/product/qa/answer`,
                { question_id, answer },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Answer submitted!");
            setAnswers((prev) => ({ ...prev, [question_id]: "" }));
            fetchQuestions();
        } catch (err) {
            alert("Failed to submit answer");
        }
    };

    // Pagination
    const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
    const paginated = questions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) return <div className={styles.loading}>Loading questions...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Customer Questions</h2>

            {questions.length === 0 && (
                <p className={styles.empty}>No questions yet.</p>
            )}

            {paginated.map((q) => (
                <div key={q.question_id} className={styles.card}>

                    {/* Product Info */}
                    <div className={styles.productRow}>
                        {q.image_urls?.length > 0 && (
                            <img
                                src={q.image_urls[0]}
                                alt={q.product_name}
                                className={styles.productImage}
                            />
                        )}
                        <div className={styles.productInfo}>
                            <p className={styles.productName}>{q.product_name}</p>
                            {q.sku && (
                                <p className={styles.productSku}>SKU: {q.sku}</p>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={styles.divider} />

                    {/* Question */}
                    <p className={styles.questionText}>
                        <span className={styles.qLabel}>Q:</span> {q.question}
                    </p>

                    {/* Existing Answers */}
                    {q.answers?.length > 0 && (
                        <div className={styles.answersList}>
                            {q.answers.map((ans, i) => (
                                <div key={i} className={styles.answerItem}>
                                    <span className={styles.answerTick}>✓</span>
                                    <div>
                                        <span className={styles.answeredBy}>{ans.answered_by}: </span>
                                        <span className={styles.answerText}>{ans.answer}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Answer Input */}
                    <textarea
                        rows={2}
                        placeholder="Write your answer..."
                        value={answers[q.question_id] || ""}
                        onChange={(e) => setAnswers((prev) => ({
                            ...prev,
                            [q.question_id]: e.target.value
                        }))}
                        className={styles.textarea}
                    />
                    <button
                        onClick={() => handleAnswer(q.question_id)}
                        className={styles.submitBtn}
                    >
                        Submit Answer
                    </button>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span className={styles.pageInfo}>Page {page} of {totalPages}</span>



                    <button
                        className={styles.pageBtn}
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}