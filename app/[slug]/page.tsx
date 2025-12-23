import Image from "next/image";
import {
  FaStar, FaRegStar, FaStarHalfAlt, FaBalanceScale, FaHeart,
  FaCreditCard, FaShieldAlt, FaTruck, FaFacebookF, FaInstagram, FaTwitter, FaYoutube
} from "react-icons/fa";
import { MdStars } from "react-icons/md";
import Specifications from "./Specifications";
import ProductList from "./ProductList";
import FAQ from "./FAQ";
import ProductDetails from "./ProductDetails";
import PriceTable from "./PriceTable";
import ProductVariants from "./ProductVariants";

// Data fetching logic
import { notFound } from 'next/navigation';
import ImageGallery from "@/components/ui/ImageGallery";
interface PageParams {
  params: { slug: string }
}
type FeaturedSpec = {
  text: string;
  icon: string;
};

export default async function ProductPage({ params }: PageParams) {
  const { slug } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return notFound();
  const product = await res.json();



  const rating = product.rating; // e.g. 4.2
const ratingCount = product.rating_count; // e.g. 123

  // Helper function to determine category slug from product
  const getCategorySlug = (product: any): string | undefined => {
    // First, try to get from product.category?.slug if available
    if (product.category?.slug) {
      return product.category.slug;
    }
    
    // Use tags array if available (e.g., ["iphone"] -> "iphone")
    if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
      return product.tags[0]; // Use first tag as category slug
    }
    
    // If brand is Apple or product name contains iPhone, try common iPhone category slugs
    if (product.brand?.name?.toLowerCase().includes('apple') || 
        product.name?.toLowerCase().includes('iphone')) {
      // Try common iPhone category slugs
      return 'iphone'; // Use 'iphone' as category slug
    }
    
    // Try to infer from brand slug if available
    if (product.brand?.slug) {
      return product.brand.slug;
    }
    
    return undefined;
  };

  const categorySlug = getCategorySlug(product);

  // You can now use 'product' to make the UI dynamic as needed

  // The rest of the code is your original UI layout
  // ...existing code...
  // (Paste your original UI code here, using the fetched 'product' as needed)
  return (
    <div className="bg-[#f5f5f5]">
      <div className="w-11/12 mx-auto py-4 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 justify-center">
          {/* Left Column - Product Images */}

          <ImageGallery photos={product.photos} />
         
          {/* Middle Column - Product Details & Options */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full h-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden">
              {/* Product Title */}
              <h1 className="md:text-[24px] text-[20px] font-bold text-gray-900 mb-2">{product.name}</h1>
              {/* Pricing Information */}
              <div className="">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="md:text-[26px] text-[22px] font-bold text-orange-600">{product.main_price}</span>
                  <span className="text-[16px] text-gray-400 line-through">{product.stroked_price}</span>

                  <span className="px-3 py-1  bg-[#E7F3EC] text-[#0A8544] text-sm font-medium rounded-2xl">
                    {product.discount} off
                  </span>
                  {/* <span className="px-3 py-1 bg-[#FFEFCC] text-[#FFB20B] text-sm font-semibold rounded-2xl">
                    Earn 200-Points
                  </span> */}
                </div>
              </div>
              {/* Product Variants - Color, Storage, Region */}
              <ProductVariants
                choiceOptions={product.choice_options || []}
                colors={product.colors || []}
                otherFeatures={product.other_features}
                currentStock={product.current_stock}
                sku={product.model_number || "iPhone-13-saq"}
                variants={product.variants || []}
              />


              {/* Region Options */}
              {/* <div className="flex bg-[#f4f4f4] items-center p-2 mb-3">
                <div className=" text-sm font-medium text-gray-700 mr-5 ">Region: </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-1 rounded text-[12px] font-medium transition bg-gray-900 text-white">International</button>
                  <button className="px-4 py-1 rounded text-[12px] font-medium transition bg-[#E5E5E5] text-gray-700 hover:bg-gray-300">Usa</button>
                  <button className="px-4 py-1 rounded text-[12px] font-medium transition bg-[#E5E5E5] text-gray-700 hover:bg-gray-300">China</button>
                </div>
              </div> */}

              {/* Quantity Selector */}
              <div className="mb-4 flex items-center ">
                <div className=" text-sm font-medium text-gray-700 mr-3 ">Quantity:  </div>
                <div className="flex items-center  gap-4">
                  <div className="flex items-center w-[90px] bg-[#f4f4f4] h-[38px] border border-gray-300 rounded overflow-hidden">

                    {/* Minus */}
                    <button className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] bg-orange-500 rounded-full text-white hover:text-black ml-1 flex items-center justify-center  font-semibold  hover:bg-gray-100 transition">
                      −
                    </button>

                    {/* Quantity */}
                    <input type="text" value={1} readOnly className="w-full h-full bg-[#f4f4f4] text-center text-sm font-medium text-gray-800 focus:outline-none" />

                    {/* Plus */}
                    <button className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] rounded-full text-white flex bg-orange-500 items-center justify-center  font-semibold  hover:text-black mr-1 hover:bg-gray-100 transition">
                      +
                    </button>

                  </div>

                  <span className="md:text-sm text-[12px] text-[#B3D9C5] font-bold">
                    Call For Online Order (09678-664664)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <button className="flex-1 2xl:text-base text-xs bg-gray-800 text-white px-6 py-3 rounded font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button className="flex-1 2xl:text-base text-xs bg-orange-500 text-white px-6 py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Messaging Options */}
              <div className="flex gap-3">
                <button className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.404-.405.765-.674 1.08-.27.315-.58.58-.93.795-.35.215-.73.38-1.14.495-.41.115-.84.173-1.29.173-.45 0-.88-.058-1.29-.173-.41-.115-.79-.28-1.14-.495-.35-.215-.66-.48-.93-.795-.27-.315-.495-.676-.674-1.08-.18-.404-.27-.83-.27-1.278 0-.448.09-.874.27-1.278.18-.404.405-.765.674-1.08.27-.315.58-.58.93-.795.35-.215.73-.38 1.14-.495.41-.115.84-.173 1.29-.173.45 0 .88.058 1.29.173.41.115.79.28 1.14.495.35.215.66.48.93.795.27.315.495.676.674 1.08.18.404.27.83.27 1.278 0 .448-.09.874-.27 1.278z" />
                  </svg>
                  Via Messenger
                </button>
                <button className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Via Whats app
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full space-y-6 max-h-[773px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
              {/* Warranty Details */}

              {/* Viewer Count */}
              {product.featured_specs?.map((item: FeaturedSpec, index: number) => (
  <div
    key={index}
    className="flex font-medium items-center gap-2 text-sm bg-[#F4F4F4] p-4 text-gray-700 "
  >
    <Image
      src={item.icon}
      alt=""
      width={500}
      height={500}
      className="w-5 h-5 object-contain"
    />
    <span>{item.text}</span>
  </div>
))}

              {/* Rating and Reviews */}
              <div className="flex items-center p-4 mb-3 bg-[#f4f4f4] gap-2">
  <div className="flex items-center font-medium text-sm text-gray-700 mr-3">
    <MdStars className="w-5 h-5 text-black mr-2" />
    Rating:
  </div>

  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => {
      if (rating >= star) {
        // full star
        return <FaStar key={star} className="w-5 h-5 text-orange-500" />;
      }

      if (rating >= star - 0.5) {
        // half star
        return <FaStarHalfAlt key={star} className="w-5 h-5 text-orange-500" />;
      }

      // empty star
      return <FaRegStar key={star} className="w-5 h-5 text-gray-300" />;
    })}
  </div>

  <span className="text-sm text-gray-700">
    ({rating.toFixed(1)}) / {ratingCount > 0 ? `${ratingCount}+ Reviews` : "No reviews"}
  </span>
</div>

              {/* Secondary Action Buttons */}
              <div className="flex gap-2 mb-3">
                <button className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm font-medium bg-[#f4f4f4] hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaBalanceScale className="w-4 h-4" />
                  Add Compare
                </button>
                <button className="flex-1 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaHeart className="w-4 h-4" />
                  Add Wishlist
                </button>
              </div>

              {/* Payment Plans */}
              <button className="w-full mb-3 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <FaCreditCard className="w-4 h-4" />
                EMI-View Plans
              </button>

              {/* Payment & Shipping Info */}
               <div className="flex gap-2 mb-3">
                <button className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm font-medium bg-[#f4f4f4] hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaShieldAlt className="w-5 h-5 text-black" />
                  <span>Secure Payments</span>
                </button>
                <button className="flex-1 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaTruck className="w-5 h-5 text-black" />
                  <span>Shipping & Charge</span>
                </button>
              </div>
             

              {/* Share Options */}
              <div className="pt-4 flex items-center border-t border-gray-200">
                <p className="text-sm text-gray-700 mr-3">Share:</p>
                <div className="flex gap-3">
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaFacebookF className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaInstagram className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaTwitter className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaYoutube className="text-black text-lg" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Summary Section ends */}

      {/* Specifications Section */}
     <div className="w-11/12 mx-auto gap-8 flex justify-between  pb-4">
      <div className="w-[59.375vw] max-w-[1140px] min-w-[700px] ">
       <Specifications specifications={product.specifications || []} />
       <FAQ faqs={product.faqs || []} />
       </div>

  <div className="w-[28.645vw] max-w-[550px] rounded-xl  min-w-[320px] ">
    <ProductList
       relatedProducts={product.frequently_bought_products || []}
       recentlyViewed={product.recentlyViewed || []}
    />
  </div>
</div>
{/* Product Details */}
<div className="bg-white w-11/12 mx-auto p-8">
<div>
  <ProductDetails description={product.description || ''} />
</div>
<div className="">
      <PriceTable
        categoryName={product.category_info?.category_name || product.brand?.name || product.name}
        categorySlug={categorySlug}
        location="Bangladesh"
        year={new Date().getFullYear()}
        data={product.priceTableData || []}
        latestPriceList={product.latest_price_list || []}
        categoryInfo={product.category_info}
      />
    </div>
    </div>
   
    </div>
  )
}