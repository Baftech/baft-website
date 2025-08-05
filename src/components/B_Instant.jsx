// eslint-disable-next-line
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function CoinStackSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("spread");
    }
  }, [inView, controls]);

  const coinVariants = {
    initial: { y: 0 },
    spread: (offset) => ({
      y: offset,
      transition: { delay: 0.2, duration: 1 },
    }),
  };

  return (
    <section
      ref={ref}
      className="bg-black w-full h-screen relative min-h-screen flex flex-col items-center justify-center "
    >      <div className="flex flex-col items-center relative">
        {/* Top Coin */}
        <motion.img
          src="/coin.png"
          alt="Top Coin"
          className="w-24 opacity-30"
          custom={-8} // Moves up to create a space of 4
          variants={coinVariants}
          initial="initial"
          animate={controls}
        />

        {/* Center Coin (Static) */}
        <img
          src="/coin.png"
          alt="Center Coin"
          className="w-24 opacity-30 my-3"
        />

        {/* Bottom Coin */}
        <motion.img
          src="/coin.png"
          alt="Bottom Coin"
          className="w-24 opacity-30"
          custom={8} // Moves down to create a space of 4
          variants={coinVariants}
          initial="initial"
          animate={controls}
        />
      </div>

      {/* Text that fades in */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-amber-50">Do Money, Differently.</h2>
        <p className="text-gray-400 mt-2">Unstacked. Unlimited.</p>
      </motion.div>
    </section>
  );
}
