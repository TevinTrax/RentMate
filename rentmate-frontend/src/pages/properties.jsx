import Cards from "../components/card.jsx";
import PropertyNotice from "./propertynotice.jsx";

function Properties() {
  return (
    <section className="w-full">
      <div className="container mx-auto block p-6">
        <h1 className="text-5xl text-center p-2 mt-2 font-semibold">
            Featured Properties
        </h1>

        <p className="w-2/3 text-center mx-auto text-gray-500 text-lg">
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
