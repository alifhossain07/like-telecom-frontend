import BannerHighlights from "./Components/Home/BannerHighlights";
import DisplayPhones from "./Components/Home/DisplayPhones";
import FlashSale from "./Components/Home/FlashSale";
import Hero from "./Components/Home/Hero";
import NewArrival from "./Components/Home/NewArrival";
import ShopFavTech from "./Components/Home/ShopFavTech";

export default function Home() {
  return (
    <div>
      <Hero />
      <DisplayPhones />
      <FlashSale />
      <BannerHighlights />
      <NewArrival />
      <ShopFavTech/>
    </div>
  );
}
