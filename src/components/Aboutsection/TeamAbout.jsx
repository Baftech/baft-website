import React, { useState } from 'react';

const TeamAbout = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      id: 'dion',
      name: 'Dion Monteiro',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6bb801dfc1951b4f4445dea9a7723a3c0ca9e92f?width=1105',
      position: { left: '23px', top: '233px', width: '211px', height: '393px' },
      description: 'Co-founder and Tech Lead at BaFT Technologies. Passionate about building seamless user experiences.'
    },
    {
      id: 'vibha',
      name: 'Vibha Harish',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6bb801dfc1951b4f4445dea9a7723a3c0ca9e92f?width=1105',
      position: { left: '207px', top: '233px', width: '118px', height: '393px' },
      description: 'Co-founder and Product Head at BaFT Technologies. Focused on creating customer-first solutions.'
    },
    {
      id: 'saket',
      name: 'Saket Borkar',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6bb801dfc1951b4f4445dea9a7723a3c0ca9e92f?width=1105',
      position: { left: '304px', top: '233px', width: '217px', height: '393px' },
      description: 'Co-founder and Strategy Lead at BaFT Technologies. Expert in financial services innovation.'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20" data-theme="light">
      <div className="max-w-7xl mx-auto px-16">
        {/* Top Video Section */}
        <div className="relative mb-32">
          <div className="flex justify-between items-start">
            {/* Left Content */}
            <div className="flex flex-col gap-5 max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 opacity-60">
                  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6977 20.1753C9.55584 16.1464 5.36588 11.9601 1.32505 10.8109C0.872034 10.6646 0.872496 10.3442 1.32594 10.1919C5.37739 9.04706 9.57209 4.88015 10.7329 0.847218C10.8578 0.403156 11.1575 0.403588 11.2812 0.848009C12.423 4.88426 16.613 9.06326 20.6466 10.2197C21.0996 10.3661 21.0991 10.6938 20.6457 10.8388C16.6015 11.9763 12.3994 16.1505 11.246 20.1761C11.1211 20.6275 10.8213 20.6271 10.6977 20.1753Z" fill="#3766B7"/>
                  </svg>
                  <span className="text-blue-900 font-semibold text-base">Know Our Story</span>
                </div>
                <h1 className="text-blue-600 text-7xl font-bold leading-none" style={{ fontFamily: 'EB Garamond' }}>
                  The Video
                </h1>
              </div>
              <p className="text-black text-lg leading-relaxed max-w-md">
                BaFT Technologies is a next-gen neo-banking startup headquartered in Bangalore, proudly founded in 2025. We're a tight-knit team of financial innovators and tech experts on a mission: to reimagine financial services in India with customer-first solutions.
              </p>
            </div>

            {/* Right Video Section */}
            <div className="relative">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/25805b85ee9b7ab1a9bb9121e0ef8891b372b99b?width=2516" 
                alt="Team video"
                className="w-full max-w-4xl rounded-3xl"
              />
              {/* Scrollbar */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8">
                <div className="w-4 h-80 bg-gray-300 bg-opacity-85 rounded-full relative">
                  <div className="w-4 h-14 bg-blue-900 rounded-full absolute top-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Safe & Secure Section */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl bg-black rounded-3xl p-9 h-80">
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col gap-6 max-w-md">
                <h2 className="text-white text-4xl font-bold" style={{ fontFamily: 'EB Garamond' }}>
                  Safe & Secure
                </h2>
                <p className="text-white text-opacity-55 text-sm leading-relaxed">
                  At BAFT, we know trust isn't built in a day. That's why every payment, every detail, and every account is protected with care. No hidden risks. Just the security you deserve while managing your money.
                </p>
                <div className="bg-white bg-opacity-10 rounded-2xl px-4 py-3 inline-flex items-center max-w-fit">
                  <span className="text-black text-xs font-medium">Learn More</span>
                </div>
              </div>
              <div className="w-72 h-72 bg-black flex justify-center items-center rounded-lg">
                {/* Placeholder for security illustration */}
                <div className="w-64 h-64 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main About Section */}
        <div className="flex justify-between items-center gap-20 mt-20">
          {/* Left Content */}
          <div className="flex flex-col gap-12 max-w-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.6977 20.1753C9.55584 16.1464 5.36588 11.9601 1.32505 10.8109C0.872034 10.6646 0.872496 10.3442 1.32594 10.1919C5.37739 9.04706 9.57209 4.88015 10.7329 0.847218C10.8578 0.403156 11.1575 0.403588 11.2812 0.848009C12.423 4.88426 16.613 9.06326 20.6466 10.2197C21.0996 10.3661 21.0991 10.6938 20.6457 10.8388C16.6015 11.9763 12.3994 16.1505 11.246 20.1761C11.1211 20.6275 10.8213 20.6271 10.6977 20.1753Z" fill="#3766B7"/>
                </svg>
                <span className="text-blue-900 text-lg">Know Our Story</span>
              </div>
              <h1 className="text-blue-600 text-6xl font-bold leading-none" style={{ fontFamily: 'EB Garamond' }}>
                About BaFT
              </h1>
            </div>

            <div className="text-gray-600 text-2xl leading-relaxed max-h-60 overflow-hidden">
              We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say… enjoyable experience. Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born. At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.
            </div>

            <button className="bg-blue-50 text-blue-900 px-12 py-6 rounded-full text-base font-normal max-w-fit">
              Read More
            </button>
          </div>

          {/* Right Team Image Section */}
          <div className="relative">
            <div className="w-[553px] h-[782px] relative rounded-3xl overflow-hidden">
              {/* Base team image */}
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/c21ccf9d0d903a404042c4e880ce8a0e6456886c?width=1105"
                alt="Team members"
                className="w-full h-full object-cover"
                style={{
                  opacity: hoveredMember ? 0.5 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              />

              {/* Individual team member overlays */}
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="absolute cursor-pointer transition-all duration-300 ease-in-out"
                  style={{
                    left: member.position.left,
                    top: member.position.top,
                    width: member.position.width,
                    height: member.position.height,
                    opacity: hoveredMember === null ? 0.5 : hoveredMember === member.id ? 1 : 0.3,
                    zIndex: hoveredMember === member.id ? 20 : 10
                  }}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="w-full h-full relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Member details overlay */}
                    {hoveredMember === member.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 transition-all duration-300">
                        <h3 className="text-white text-lg font-bold mb-1">{member.name}</h3>
                        <p className="text-white text-sm opacity-90 leading-relaxed">{member.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex justify-center items-center mt-16 px-16 py-6">
          <div className="flex justify-between items-center w-full max-w-7xl">
            <div className="flex items-center gap-6">
              <button className="text-blue-900 px-5 py-6 rounded-full text-base">
                About Baft
              </button>
              <button className="text-blue-900 px-6 py-6 rounded-full text-base">
                Let's Chat
              </button>
            </div>

            {/* BAFT Logo */}
            <svg width="140" height="72" viewBox="0 0 140 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.94962 17.9335C9.94278 17.765 9.92361 16.9543 10.5385 16.2696C11.2533 15.4726 12.2448 15.4959 12.3818 15.5013H33.7342C37.5769 15.4876 41.1224 17.5048 42.952 20.7751C45.028 24.4877 44.557 29.2136 41.7441 32.603C41.7291 32.6208 41.714 32.6373 41.6989 32.6537C36.2622 38.0822 30.8255 43.5107 25.3888 48.9392C25.3641 48.9652 25.0122 49.3404 25.1327 49.8526C25.2025 50.1484 25.4052 50.3922 25.6791 50.5195C25.7654 50.5592 25.8599 50.577 25.9544 50.577H35.4474C35.4679 50.577 35.4871 50.577 35.5076 50.5743C39.212 50.2799 42.0632 47.4985 42.3398 44.2693C42.5288 42.0591 41.4949 39.857 39.6708 38.3752C39.3585 38.1219 39.3284 37.6576 39.6105 37.3701C40.3295 36.6401 41.0471 35.9102 41.766 35.1789C42.0098 34.9311 42.4028 34.9064 42.674 35.1255C45.773 37.6344 47.352 41.551 46.744 45.3772C46.0004 50.058 42.1111 53.8171 37.166 54.5101C37.1332 54.5142 37.1003 54.5169 37.0674 54.5169H16.219C16.1875 54.5169 16.1546 54.5197 16.1231 54.5238C15.5247 54.6046 14.9988 54.2978 14.8564 53.8596C14.7646 53.5761 14.8536 53.3063 14.9276 53.1516C14.9604 53.0818 15.0056 53.0188 15.059 52.9653C22.5225 45.4676 29.986 37.9699 37.4495 30.4722C37.4646 30.4571 37.4797 30.4407 37.4933 30.4242C39.2134 28.3632 39.5229 25.5093 38.2917 23.2798C36.7456 20.482 33.5849 20.1383 33.1974 20.1068C33.181 20.1068 33.1645 20.1054 33.1481 20.1041C27.547 20.0698 21.946 20.0356 16.3449 20.0013C16.3313 20.0013 16.3189 20.0014 16.3052 20C16.1601 19.9904 15.8684 19.9945 15.5575 20.1547C15.2686 20.304 15.0919 20.5204 14.9906 20.6833C14.9248 20.7888 14.892 20.9107 14.8906 21.0353C14.8742 26.2214 14.8564 31.4075 14.8399 36.5922C14.8372 36.6607 14.8262 37.2359 15.2494 37.5645C15.6821 37.9 16.3942 37.8453 16.8886 37.3591C19.9425 34.2244 22.995 31.0898 26.0489 27.9551C26.3077 27.6894 26.3049 27.2649 26.042 27.0033C25.6777 26.6391 25.8366 26.0187 26.3296 25.8735L33.07 23.8933C33.5918 23.7399 34.0725 24.2329 33.9054 24.7506L31.8211 31.2322C31.6663 31.7142 31.0556 31.8621 30.6968 31.5034L30.5242 31.3308C30.2613 31.0679 29.834 31.0665 29.5683 31.3281L11.2533 49.4445C11.2123 49.4856 11.1657 49.5225 11.115 49.5499C10.8233 49.7129 10.4632 49.6869 10.2139 49.4842C9.99619 49.3075 9.89211 49.0172 9.93867 48.731C9.94552 48.6927 9.94962 48.6543 9.94962 48.616V17.9253V17.9335Z" fill="url(#paint0_linear_3151_1972)"/>
              <path d="M58.6012 54.3575C56.3635 54.3575 54.5052 53.9782 53.0262 53.2209C51.5458 52.4636 50.4461 51.4447 49.7244 50.1629C49.0027 48.8825 48.6426 47.5021 48.6426 46.0217C48.6426 44.2181 49.1109 42.6748 50.0504 41.3943C50.9884 40.1139 52.3237 39.1306 54.056 38.4445C55.7884 37.7598 57.8631 37.4161 60.2802 37.4161H66.4112C66.9439 37.4161 67.3739 36.9642 67.3383 36.4328C67.2589 35.277 67.0356 34.2869 66.6673 33.4652C66.1975 32.419 65.5032 31.6343 64.583 31.1111C63.6627 30.588 62.4987 30.3264 61.0922 30.3264C59.4681 30.3264 58.0781 30.714 56.925 31.4905C55.9445 32.1492 55.2776 33.0736 54.9215 34.2636C54.8037 34.6566 54.4463 34.9278 54.0368 34.9278H50.4366C49.8559 34.9278 49.404 34.3965 49.5272 33.8281C49.8408 32.382 50.4393 31.1153 51.3226 30.0293C52.4236 28.6763 53.8396 27.63 55.572 26.8905C57.3043 26.151 59.1449 25.7812 61.0936 25.7812C63.6558 25.7812 65.8018 26.2332 67.5341 27.1343C69.2665 28.0367 70.5743 29.3089 71.459 30.9509C72.3423 32.5929 72.7846 34.5498 72.7846 36.8231V52.7854C72.7846 53.2962 72.3696 53.7111 71.8588 53.7111H68.9186C68.4407 53.7111 68.0422 53.3482 67.997 52.8717L67.8806 51.631C67.8039 50.8093 66.7796 50.5121 66.2523 51.1475C66.2468 51.1544 66.2414 51.1599 66.2359 51.1667C65.695 51.8158 65.054 52.3759 64.3145 52.8443C63.575 53.314 62.726 53.6838 61.7701 53.9535C60.8142 54.2247 59.7584 54.3589 58.6039 54.3589L58.6012 54.3575ZM59.6297 49.9739C60.7841 49.9739 61.8304 49.7397 62.7684 49.27C63.7065 48.8017 64.509 48.1608 65.1773 47.3487C65.8442 46.5366 66.3495 45.6163 66.6933 44.5879C67.0356 43.5594 67.2246 42.5036 67.2616 41.4217V41.2588H60.8211C59.2695 41.2588 58.0151 41.4477 57.0592 41.8271C56.1033 42.2064 55.4077 42.72 54.9749 43.3691C54.5422 44.0182 54.3258 44.7769 54.3258 45.6424C54.3258 46.5079 54.5326 47.3117 54.9489 47.943C55.3638 48.5743 55.9678 49.0715 56.762 49.4316C57.5549 49.7932 58.5122 49.9726 59.631 49.9726L59.6297 49.9739Z" fill="url(#paint1_linear_3151_1972)"/>
              <path d="M76.1035 53.0721V16.4571C76.1035 16.1052 76.3884 15.8203 76.7403 15.8203H99.0116C99.3636 15.8203 99.6484 16.1052 99.6484 16.4571V19.6219C99.6484 19.9738 99.3636 20.2587 99.0116 20.2587H82.1524C81.8004 20.2587 81.5156 20.5435 81.5156 20.8955V31.9086C81.5156 32.2605 81.8004 32.5454 82.1524 32.5454H96.0345C96.3864 32.5454 96.6713 32.8302 96.6713 33.1822V36.2388C96.6713 36.5907 96.3864 36.8756 96.0345 36.8756H82.1524C81.8004 36.8756 81.5156 37.1604 81.5156 37.5124V53.0721C81.5156 53.424 81.2307 53.7088 80.8788 53.7088H76.7403C76.3884 53.7088 76.1035 53.424 76.1035 53.0721Z" fill="url(#paint2_linear_3151_1972)"/>
              <path d="M113.401 52.9449V21.0189C113.401 20.5985 113.06 20.2562 112.638 20.2562H102.959C102.539 20.2562 102.196 19.9152 102.196 19.4934V16.5792C102.196 16.1588 102.537 15.8164 102.959 15.8164H129.31C129.73 15.8164 130.073 16.1574 130.073 16.5792V19.4934C130.073 19.9138 129.732 20.2562 129.31 20.2562H119.576C119.156 20.2562 118.813 20.5972 118.813 21.0189V52.9449C118.813 53.3653 118.472 53.7077 118.05 53.7077H114.163C113.742 53.7077 113.4 53.3667 113.4 52.9449H113.401Z" fill="url(#paint3_linear_3151_1972)"/>
              <defs>
                <linearGradient id="paint0_linear_3151_1972" x1="28.4002" y1="15.5" x2="28.4002" y2="54.5367" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#092646"/>
                  <stop offset="1" stopColor="#3766B7"/>
                </linearGradient>
                <linearGradient id="paint1_linear_3151_1972" x1="60.7136" y1="25.7812" x2="60.7136" y2="54.3589" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#092646"/>
                  <stop offset="1" stopColor="#3766B7"/>
                </linearGradient>
                <linearGradient id="paint2_linear_3151_1972" x1="87.876" y1="15.8203" x2="87.876" y2="53.7088" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#092646"/>
                  <stop offset="1" stopColor="#3766B7"/>
                </linearGradient>
                <linearGradient id="paint3_linear_3151_1972" x1="116.135" y1="15.8164" x2="116.135" y2="53.7077" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#092646"/>
                  <stop offset="1" stopColor="#3766B7"/>
                </linearGradient>
              </defs>
            </svg>

            <div className="flex items-center">
              <button className="border-2 border-blue-700 text-blue-900 px-18 py-5 rounded-full text-base font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAbout;
