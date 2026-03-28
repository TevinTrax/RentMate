import Cards from "../../components/card.jsx";
import PropertyNotice from "./PropertyNotice.jsx";
import { motion } from "framer-motion";

function Properties() {
  return (
    <section className="w-full bg-green-50 py-12">
      <div className="container mx-auto px-4">

        {/* Animated Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl text-center text-green-800 font-extrabold mb-4"
        >
          Featured Properties
        </motion.h1>

        {/* Animated Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl text-center mx-auto text-gray-700 text-md sm:text-lg mb-10"
        >
          Discover premium rental properties managed through our platform. Each property offers modern amenities, 
          professional management, and a seamless rental experience.
        </motion.p>

        {/* Property Cards */}
        <Cards />

        {/* Notice Section */}
        <PropertyNotice />

      </div>
    </section>
  );
}

export default Properties;