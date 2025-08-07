import React from "react";


const SecurityCard = () => {
  return (
    <div className="bg-black text-white w-full max-w-5xl mx-auto rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-40 mb-15">
      {/* Left Text Section */}
      <div className="md:w-1/2 mt-20 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 libertinus-serif-bold">
          Safe & Secure
        </h2>
        <p className="text-gray-400 leading-relaxed desc">
          At BAFT, we know trust isn't built in a day. That's why every payment, every detail, and every account is protected with care. No hidden risks. Just the security you deserve while managing your money.
        </p>
      </div>

      {/* Right Circular Logo Section */}
      <div className="md:w-1/2 flex justify-center">
        <div className="security-logo-container">
         <img
            src="/secure_coin.png"
            alt="Security Logo" className="w-64 h-64 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;
