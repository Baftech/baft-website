import React from "react";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  return (
    <section className="bg-white min-h-screen">
      <div className="mt-10 grid grid-cols-2 gap-4 px-12 py-10">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-2 flex items-center gap-2">
            <span className="text-xs">🔹</span> Features
          </p>
          <h1
            className="leading-none mb-8"
            style={{
              fontFamily: "EB Garamond",
              fontSize: "4.5rem",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            <span className="block text-[rgba(25,102,187,1)]">All in</span>
            <span className="block text-[rgba(25,102,187,1)]">One Place</span>
          </h1>

          <ul className="space-y-8 text-sm">
            <li className="flex items-start gap-4">
              <FaCreditCard className="text-[rgba(25,102,187,1)] text-xl mt-1" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)]">
                  Pay Bills
                </h6>
                <p className="text-gray-600">
                  Sort your bills with automated payments and reminders.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaUser className="text-[rgba(25,102,187,1)] text-xl mt-1" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)]">
                  Manage Account
                </h6>
                <p className="text-gray-600">
                  Control your finances with management tools and insights.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaGift className="text-[rgba(25,102,187,1)] text-xl mt-1" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)]">
                  Rewards
                </h6>
                <p className="text-gray-600">
                  Earn points and redeem them for rewards and benefits.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaShieldAlt className="text-[rgba(25,102,187,1)] text-xl mt-1" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)]">
                  Seamless Payments
                </h6>
                <p className="text-gray-600">
                  Send and receive coins instantly with just a few taps.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Column: Stacked Cards */}
        <div className="relative flex items-center justify-center h-screen w-full mt-22">
          {/* Bottom Card (card4) */}
          <img
            src="/card4.png"
            alt="Card 4"
            className="absolute w-[280px] h-[400px] object-cover rounded-5xl shadow-lg transform -translate-y-16 z-10"
          />
          
          {/* Third Card (card3) */}
          <img
            src="/card3.png"
            alt="Card 3"
            className="absolute w-[280px] h-[400px] object-cover rounded-5xl shadow-xl transform -translate-y-12 z-20"
          />
          
          {/* Second Card (card2) */}
          <img
            src="/card2.png"
            alt="Card 2"
            className="absolute w-[280px] h-[400px] object-cover rounded-5xl shadow-2xl transform -translate-y-6 z-30"
          />
          
          {/* Top Card (card1) */}
          <img
            src="/card1.png"
            alt="Card 1"
            className="relative w-[280px] h-[400px] object-cover rounded-5xl shadow-2xl z-40"
          />
        </div>

      </div>
    </section>
  );
};

export default Features;
