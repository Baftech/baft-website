import React from "react";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">

        {/* Left Column */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-2 flex items-center gap-2">
            <span className="text-xs">🔹</span> Features
          </p>
          <h1
            className="leading-none mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[rgba(25,102,187,1)]"
            style={{
              fontFamily: "EB Garamond",
              lineHeight: 1.1,
            }}
          >
            <span className="block">All in</span>
            <span className="block">One Place</span>
          </h1>

          <ul className="space-y-4 md:space-y-6 lg:space-y-8 text-sm md:text-base">
            <li className="flex items-start gap-3 md:gap-4">
              <FaCreditCard className="text-[rgba(25,102,187,1)] text-lg md:text-xl mt-1 flex-shrink-0" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)] text-sm md:text-base">
                  Pay Bills
                </h6>
                <p className="text-gray-600 text-sm md:text-base">
                  Sort your bills with automated payments and reminders.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 md:gap-4">
              <FaUser className="text-[rgba(25,102,187,1)] text-lg md:text-xl mt-1 flex-shrink-0" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)] text-sm md:text-base">
                  Manage Account
                </h6>
                <p className="text-gray-600 text-sm md:text-base">
                  Control your finances with management tools and insights.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 md:gap-4">
              <FaGift className="text-[rgba(25,102,187,1)] text-lg md:text-xl mt-1 flex-shrink-0" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)] text-sm md:text-base">
                  Rewards
                </h6>
                <p className="text-gray-600 text-sm md:text-base">
                  Earn points and redeem them for rewards and benefits.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 md:gap-4">
              <FaShieldAlt className="text-[rgba(25,102,187,1)] text-lg md:text-xl mt-1 flex-shrink-0" />
              <div>
                <h6 className="font-semibold text-[rgba(25,102,187,1)] text-sm md:text-base">
                  Seamless Payments
                </h6>
                <p className="text-gray-600 text-sm md:text-base">
                  Send and receive coins instantly with just a few taps.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Column: Stacked Cards */}
        <div className="relative flex items-center justify-center h-64 sm:h-80 md:h-96 lg:h-screen w-full order-1 lg:order-2">
          {/* Bottom Card (card4) */}
          <img
            src="/card4.png"
            alt="Card 4"
            className="absolute w-[400px] h-[220px] object-cover rounded-2xl shadow-lg transform -translate-y-14 z-10"
          />

          <img
            src="/card3.png"
            alt="Card 3"
            className="absolute w-[400px] h-[220px] object-cover rounded-2xl shadow-xl transform -translate-y-10 z-20"
          />

          <img
            src="/card2.png"
            alt="Card 2"
            className="absolute w-[400px] h-[220px] object-cover rounded-2xl shadow-2xl transform -translate-y-5 z-30"
          />

          <img
            src="/card1.png"
            alt="Card 1"
            className="absolute w-[400px] h-[220px] object-cover rounded-2xl shadow-2xl z-40"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
