import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import Loader from "../../Loader/Loader";

const FaqAddEdit = ({ token, routepath }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        isActive: true,
        order: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEdit) return;

        const fetchFAQ = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URI}/api/faq/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const faq = res.data?.data;
                setFormData({
                    question: faq?.question || "",
                    answer: faq?.answer || "",
                    isActive: faq?.isActive ?? true,
                    order: faq?.order ?? 0,
                });
            } catch (err) {
                if ([401, 403].includes(err.response?.status)) logoutUtil();
            } finally {
                setLoading(false);
            }
        };

        fetchFAQ();
    }, [id, isEdit, token]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((p) => ({ ...p, [name]: checked }));
        } else {
            setFormData((p) => ({ ...p, [name]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            isEdit
                ? await axios.put(`${API_URI}/api/faq/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                : await axios.post(`${API_URI}/api/faq`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

            navigate(-1);
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) logoutUtil();
            else alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 pt-[60px] bg-gray-50 overflow-y-auto">
            {loading && <Loader />}

            <Header
                title={isEdit ? "Edit FAQ" : "Add FAQ"}
                handleClick={() => navigate(`${routepath}faq`)}
                addTitle="Back"
            />

            <form
                onSubmit={handleSubmit}
                className="mt-6 max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm p-6 space-y-6"
            >
                <div>
                    <label className="font-medium">Question</label>
                    <input
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        className="w-full mt-1 border px-4 py-2 rounded-lg"
                        placeholder="Enter question"
                        required
                    />
                </div>

                {/* ANSWER */}
                <div>
                    <label className="font-medium">Answer</label>
                    <textarea
                        name="answer"
                        rows="5"
                        value={formData.answer}
                        onChange={handleChange}
                        className="w-full mt-1 border px-4 py-2 rounded-lg"
                        placeholder="Enter answer"
                        required
                    />
                </div>

                {/* ORDER */}
                <div>
                    <label className="font-medium">Display Order</label>
                    <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="w-full mt-1 border px-4 py-2 rounded-lg"
                        onWheel={(e) => e.target.blur()}
                    />
                </div>

                {/* ACTIVE */}
                <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Active</span>
                    <label className="relative inline-flex cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        {loading ? "Saving..." : isEdit ? "Update FAQ" : "Add FAQ"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FaqAddEdit;
