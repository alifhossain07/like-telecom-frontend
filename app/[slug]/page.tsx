import Image from "next/image";
import {
  FaHeart,
  FaCreditCard, FaShieldAlt, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaFacebookMessenger, FaWhatsapp, FaTruck
} from "react-icons/fa";
import ProductRating from "./ProductRating";
import Specifications from "./Specifications";
import ProductList from "./ProductList";
import FAQ from "./FAQ";
import ProductDetails from "./ProductDetails";
import PriceTable from "./PriceTable";
import ProductActions from "./ProductActions";
import AddToCompare from "./AddToCompare";
import ShippingButton from "@/components/ui/ShippingButton";

// Data fetching logic
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ImageGallery from "@/components/ui/ImageGallery";
import Link from "next/link";
interface PageParams {
  params: { slug: string }
}
type FeaturedSpec = {
  text: string;
  icon: string;
};

export default async function ProductPage({ params }: PageParams) {
  const { slug } = params;

  // Get auth token from cookie (set by client-side login)
  const cookieStore = cookies();
  const authToken = cookieStore.get('like_auth_token')?.value;

  // Call backend API directly with System-Key and Authorization (if available)
  // This ensures the backend records last-viewed products for logged-in users
  const API_BASE = process.env.API_BASE!;
  const SYSTEM_KEY = process.env.SYSTEM_KEY!;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'System-Key': SYSTEM_KEY,
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  };

  const res = await fetch(`${API_BASE}/products/${slug}`, {
    cache: 'no-store',
    headers,
  });

  if (!res.ok) return notFound();

  const json = await res.json();

  if (!json.success || !json.data || json.data.length === 0) {
    return notFound();
  }

  const product = json.data[0];

  // Fetch social links/numbers
  let messengerLink = "https://m.me/liketelecombd";
  let whatsappNumber = "01625435055";

  try {
    const socialRes = await fetch(`${API_BASE}/business-settings`, {
      headers: {
        'System-Key': SYSTEM_KEY,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (socialRes.ok) {
      const socialJson = await socialRes.json();
      if (socialJson.data && Array.isArray(socialJson.data)) {
        interface SocialLink { type: string; value: string }
        const mLink = socialJson.data.find((item: SocialLink) => item.type === 'messenger_link')?.value;
        const wNum = socialJson.data.find((item: SocialLink) => item.type === 'whatsapp_number')?.value;

        if (mLink) messengerLink = mLink;
        if (wNum) whatsappNumber = wNum;
      }
    }
  } catch (err) {
    console.error("Failed to fetch social settings:", err);
  }





  // Helper function to determine category slug from product
  const getCategorySlug = (product: { category?: { slug?: string }; tags?: string[]; brand?: { name?: string; slug?: string }; name?: string }): string | undefined => {
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
                  {product.discount &&
                    product.discount !== "0%" &&
                    product.discount !== "0" &&
                    product.discount !== "" &&
                    product.discount !== 0 && (
                      <>
                        <span className="text-[16px] text-gray-400 line-through">{product.stroked_price}</span>
                        <span className="px-3 py-1  bg-[#E7F3EC] text-[#0A8544] text-sm font-medium rounded-2xl">
                          {product.discount} off
                        </span>
                      </>
                    )}
                  {/* <span className="px-3 py-1 bg-[#FFEFCC] text-[#FFB20B] text-sm font-semibold rounded-2xl">
                    Earn 200-Points
                  </span> */}
                </div>
              </div>
              {/* Product Variants, Quantity Selector, and Action Buttons */}
              <ProductActions product={product} />

              {/* Messaging Options */}
              <div className="flex gap-3">
                <a
                  href={messengerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <FaFacebookMessenger className="w-5 h-5 text-blue-500" />
                  Via Messenger
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-500" />
                  Via WhatsApp
                </a>
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
              <ProductRating product={product} />

              {/* Estimated Shipping Time */}
              {product.est_shipping_time && (
                <div className="flex font-medium items-center gap-2 text-sm bg-[#F4F4F4] p-4 text-gray-700">
                  <FaTruck className="text-black text-xl" />
                  <span className="font-medium">
                    Delivery Time : {product.est_shipping_time} days
                  </span>
                </div>
              )}

              {/* Secondary Action Buttons */}
              <div className="flex gap-2 mb-3">
                <AddToCompare product={product} />
                <button className="flex-1 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaHeart className="w-4 h-4" />
                  Add Wishlist
                </button>
              </div>

              {/* Payment Plans */}
              <Link href="/footer/emi" className="w-full mb-3 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <FaCreditCard className="w-4 h-4" />
                EMI-View Plans
              </Link>

              {/* Payment & Shipping Info */}
              <div className="flex gap-2 mb-3">
                <Link href="/footer/terms" className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm font-medium bg-[#f4f4f4] hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaShieldAlt className="w-5 h-5 text-black" />
                  <span>Secure Payments</span>
                </Link>
                <ShippingButton />
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