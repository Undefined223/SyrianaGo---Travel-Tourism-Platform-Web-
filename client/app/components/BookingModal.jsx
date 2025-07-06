import { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { getBlockedDatesByListing, getListingAvailability } from "../lib/https/listing.https";
import { createBooking } from "../lib/https/booking.https";
import axiosInstance from "../lib/axios";
import { useUser } from "../contexts/UserContext";

const stripePromise = loadStripe("pk_test_51PHuF7HJidMgnIYBk3s3gYKdn6eUsIdvlP3YIpywZTQBpu4306UmHnoLZGQqbsPMrEfMqvJoUf1AuVihMUEjATfq00Q9XpGTZM");
function StripePaymentOptions({
    bookingPayload,
    onSuccess,
    onError,
    setSuccess,
    setError,
}) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [newCard, setNewCard] = useState(false);
    const [saveCard, setSaveCard] = useState(true);
    const [cardError, setCardError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cardActionLoading, setCardActionLoading] = useState(""); // holds id of card being updated
    const stripe = useStripe();
    const elements = useElements();

    // Fetch saved payment methods
    useEffect(() => {
        fetchPaymentMethods();
        // eslint-disable-next-line
    }, [bookingPayload.userId]);

    const fetchPaymentMethods = async () => {
        try {
            const response = await axiosInstance.get("/payments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const methods = response.data.data || [];
            setPaymentMethods(methods);

            // Auto-select default or prompt for new card
            const defaultMethod = methods.find((m) => m.isDefault);
            if (defaultMethod) {
                setSelectedMethod(defaultMethod.id);
                setNewCard(false);
            } else {
                setSelectedMethod(null);
                setNewCard(true);
            }
        } catch (err) {
            setPaymentMethods([]);
            setSelectedMethod(null);
            setNewCard(true);
        }
    };

    // Set as default card
    const handleSetDefault = async (id) => {
        setCardActionLoading(id);
        try {
            await axiosInstance.post(
                "/payments/default",
                { paymentMethodId: id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            await fetchPaymentMethods();
        } catch (err) {
            setCardError("Failed to set default card.");
        }
        setCardActionLoading("");
    };

    // Remove card
    const handleRemoveCard = async (id) => {
        setCardActionLoading(id);
        try {
            await axiosInstance.post(
                "/payments/remove",
                { paymentMethodId: id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            await fetchPaymentMethods();
        } catch (err) {
            setCardError("Failed to remove card.");
        }
        setCardActionLoading("");
    };

    // Handle payment with saved card
    const handleSavedMethod = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setCardError("");
        try {
            const payload = {
                ...bookingPayload,
                paymentMethod: "saved",
                paymentMethodId: selectedMethod,
            };
            const response = await createBooking(payload);

            if (response.requiresAction) {
                const stripeInstance = await stripePromise;
                const { error: confirmError } = await stripeInstance.confirmCardPayment(
                    response.clientSecret
                );
                if (confirmError) throw confirmError;
            }

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setCardError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle payment with new card
    const handleNewCard = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setCardError("");
        try {
            // 1. Create booking and get clientSecret
            const payload = {
                ...bookingPayload,
                paymentMethod: "stripe",
                saveCard,
            };
            const response = await createBooking(payload);
            const clientSecret = response.clientSecret;
            if (!clientSecret) throw new Error("No client secret returned");

            // 2. Confirm card payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );
            if (confirmError) throw confirmError;
            if (paymentIntent.status === "succeeded") {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setCardError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="font-bold mb-2">Select Payment Method</h3>
            {/* Saved Payment Methods */}
            <div className="mb-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`p-3 border rounded mb-2 flex items-center justify-between ${
                            selectedMethod === method.id && !newCard
                                ? "bg-green-50 border-green-400"
                                : "border-gray-200"
                        }`}
                        onClick={() => {
                            setSelectedMethod(method.id);
                            setNewCard(false);
                        }}
                    >
                        <div className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={selectedMethod === method.id && !newCard}
                                onChange={() => {
                                    setSelectedMethod(method.id);
                                    setNewCard(false);
                                }}
                                className="mr-3"
                            />
                            <div>
                                <div>
                                    {method.brand} **** {method.last4}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Expires {method.exp_month}/{method.exp_year}
                                </div>
                                {method.isDefault && (
                                    <span className="text-green-600 text-xs ml-2">Default</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!method.isDefault && (
                                <button
                                    type="button"
                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    disabled={cardActionLoading === method.id}
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleSetDefault(method.id);
                                    }}
                                >
                                    {cardActionLoading === method.id ? "Setting..." : "Set as default"}
                                </button>
                            )}
                            <button
                                type="button"
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                disabled={cardActionLoading === method.id}
                                onClick={e => {
                                    e.stopPropagation();
                                    handleRemoveCard(method.id);
                                }}
                            >
                                {cardActionLoading === method.id ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* New Card Option */}
            <div
                className={`p-3 border rounded mb-4 cursor-pointer flex items-center ${newCard ? "bg-green-50 border-green-400" : "border-gray-200"
                    }`}
                onClick={() => {
                    setNewCard(true);
                    setSelectedMethod(null);
                }}
            >
                <input
                    type="radio"
                    checked={newCard}
                    onChange={() => {
                        setNewCard(true);
                        setSelectedMethod(null);
                    }}
                    className="mr-3"
                />
                Add New Credit Card
            </div>
            {/* New Card Form */}
            {newCard && (
                <form onSubmit={handleNewCard} className="space-y-4">
                    <CardElement className="border rounded px-3 py-2" />
                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={() => setSaveCard((v) => !v)}
                            className="mr-2"
                        />
                        Save this card for future bookings
                    </label>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Book Now"}
                    </button>
                    {cardError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 text-sm mt-2">
                            {cardError}
                        </div>
                    )}
                </form>
            )}
            {/* Saved Method Payment Button */}
            {selectedMethod && !newCard && (
                <button
                    onClick={handleSavedMethod}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition mt-2"
                >
                    {loading ? "Processing..." : "Book Now"}
                </button>
            )}
        </div>
    );
}

export default function BookingModal({ open, onClose, listingId }) {
    const { t } = useLanguage();
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [unavailableDates, setUnavailableDates] = useState([]);
    const { user } = useUser(); // Assuming you have a user context or similar

    // Fetch unavailable dates (booked + blocked)
    useEffect(() => {
        if (!open) return;
        async function fetchUnavailable() {
            try {
                const [booked, blocked] = await Promise.all([
                    getListingAvailability(listingId),
                    getBlockedDatesByListing(listingId),
                ]);
                const bookedDates = booked.unavailableDates || [];
                const blockedDates = (blocked || []).flatMap((b) =>
                    getDatesInRange(b.startDate, b.endDate)
                );
                setUnavailableDates([...new Set([...bookedDates, ...blockedDates])]);
            } catch (err) {
                setUnavailableDates([]);
            }
        }
        fetchUnavailable();
    }, [open, listingId]);

    function getDatesInRange(start, end) {
        const arr = [];
        let dt = new Date(start);
        const endDt = new Date(end);
        while (dt <= endDt) {
            arr.push(dt.toISOString().split("T")[0]);
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    // Example: replace with your logic
    const price = 150;
    const userId = user?._id // Replace with your auth logic

    const bookingPayload = {
        userId,
        listingId,
        details: {
            checkIn: checkIn?.toISOString().split("T")[0],
            checkOut: checkOut?.toISOString().split("T")[0],
            guests,
            price,
        },
        paymentMethod,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await createBooking(bookingPayload);
            if (paymentMethod === "stripe" && res.clientSecret) {
                // Stripe flow handled in StripePaymentOptions
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || t("booking.error") || "Booking failed"
            );
        }
        setLoading(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative border border-green-100 animate-fadeIn">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-green-700 text-2xl font-bold transition"
                    onClick={onClose}
                    aria-label={t("common.close")}
                >
                    ×
                </button>   
                {success ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-green-700">
                            {paymentMethod === "stripe"
                                ? t("booking.paymentSuccessTitle") || "Payment Successful!"
                                : t("booking.successTitle")}
                        </h2>
                        <p className="text-gray-700 mb-6">
                            {paymentMethod === "stripe"
                                ? t("booking.paymentSuccessMessage") ||
                                "Your payment was successful. Your booking will be confirmed shortly once payment is verified."
                                : t("booking.successMessage")}
                        </p>
                        <button
                            className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
                            onClick={onClose}
                        >
                            {t("common.close")}
                        </button>
                    </div>
                ) : paymentMethod === "stripe" ? (
                    <Elements stripe={stripePromise}>
                        <StripePaymentOptions
                            bookingPayload={bookingPayload}
                            onSuccess={() => setSuccess(true)}
                            onError={setError}
                            setSuccess={setSuccess}
                            setError={setError}
                        />
                    </Elements>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4 text-center text-green-700" style={{ fontFamily: "'Tennyson BC', serif" }}>
                            {t("booking.title")}
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">{t("booking.checkIn")}</label>
                                <DatePicker
                                    selected={checkIn}
                                    onChange={(date) => {
                                        setCheckIn(date);
                                        if (checkOut && date && date > checkOut) setCheckOut(null);
                                    }}
                                    minDate={new Date()}
                                    excludeDates={unavailableDates.map((d) => new Date(d))}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    placeholderText={t("booking.checkIn")}
                                    calendarClassName="rounded-xl shadow-lg"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">{t("booking.checkOut")}</label>
                                <DatePicker
                                    selected={checkOut}
                                    onChange={(date) => setCheckOut(date)}
                                    minDate={checkIn || new Date()}
                                    excludeDates={unavailableDates.map((d) => new Date(d))}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    placeholderText={t("booking.checkOut")}
                                    disabled={!checkIn}
                                    calendarClassName="rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">{t("booking.guests")}</label>
                            <input
                                type="number"
                                min={1}
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">{t("booking.paymentMethod")}</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="cod">{t("booking.cod")}</option>
                                <option value="stripe">Credit/Debit Card</option>
                            </select>
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-xl font-bold text-lg shadow-lg transition disabled:opacity-60"
                            disabled={loading || !checkIn || !checkOut}
                        >
                            {loading ? t("booking.booking") : t("booking.bookNow")}
                        </button>
                    </form>
                )}
            </div>
            <style jsx global>{`
        .react-datepicker {
          font-family: 'Times New Roman', serif;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(51,121,20,0.08);
        }
        .react-datepicker__header {
          background: linear-gradient(135deg, #e6f4ea 0%, #f4faf6 100%);
          border-bottom: none;
          border-radius: 1rem 1rem 0 0;
        }
        .react-datepicker__day--disabled {
          color: #bbb !important;
          text-decoration: line-through;
        }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background: #337914 !important;
          color: #fff !important;
        }
      `}</style>
        </div>
    );
}