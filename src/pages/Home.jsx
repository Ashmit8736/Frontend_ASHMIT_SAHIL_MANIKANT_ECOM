import Carousel from "../components/Carousel/Carousel";
import PrefFooter from "../components/preFooter/PrefFooter";
import CategorySection from "./CategorySection";
import FeaturesSupplier from "../components/features-Supplier/FeaturesSupplier";
import PopularProduct from "../components/popular-Product/PopularProduct";

const Home = () => {
  return (
    <div>
      <Carousel />
      <CategorySection />
      <FeaturesSupplier />
      <PopularProduct />   {/* ← ab real backend products dikh rahe honge */}
      <PrefFooter />
    </div>
  );
};

export default Home;
