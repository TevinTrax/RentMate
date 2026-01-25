import Cards from "../../components/card.jsx";
import PropertyNotice from "./PropertyNotice.jsx";

function Properties() {
  return (
    <section className="w-full">
      <div className="container mx-auto block p-6">
        <h1 className="text-4xl text-center text-gray-800 py-3 mt-2 font-bold">
            Featured Properties
        </h1>

        <p className="max-w-3xl text-center mx-auto text-gray-500 text-md md:text-lg mt-2 mb-6">
            Discover premium rental properties managed through our platform. 
            Each property offers modern amenities and professional management.
        </p>

        <div className="container mx-auto mt-6">
            <Cards/>
        </div>
        <PropertyNotice/>
      </div>
    </section>
  );
}

// export at the end
export default Properties;
