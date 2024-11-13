import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import { useState, useRef } from 'react';
import paymentSound from './payment.mp3'; // Import the sound file

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState(""); // State for feedback message
    const [loading, setLoading] = useState(false); // State for loading indicator
    const audioRef = useRef(null); // Reference for audio element

    const handleTransfer = async () => {
        setLoading(true);
        setMessage(""); // Clear any previous messages

        try {
            const response = await axios.post("https://ezpay-express-server.onrender.com/api/v1/account/transfer", {
                to: id,
                amount: Number(amount), // Ensure amount is a number
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            setMessage(response.data.message || "Transfer successful!"); // Display success message
            
            // Play sound if the transfer is successful
            if (audioRef.current) {
                audioRef.current.play(); // Play the sound
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Transfer failed. Please try again.";
            setMessage(errorMessage); // Display error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? "Initiating..." : "Initiate Transfer"}
                            </button>
                            {message && <div className="text-center text-red-600">{message}</div>} {/* Display message */}
                        </div>
                    </div>
                </div>
                {/* Audio element for the sound */}
                <audio ref={audioRef} src={paymentSound} preload="auto" />
            </div>
        </div>
    );
};
