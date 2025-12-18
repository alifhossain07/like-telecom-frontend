'use client'

import { useState } from 'react'
import Image from "next/image";
import {
  FaEye, FaShoppingBag, FaStar, FaRegStar, FaStarHalfAlt, FaBalanceScale, FaHeart,
  FaCreditCard, FaShieldAlt, FaTruck, FaFacebookF, FaInstagram, FaTwitter, FaYoutube
} from "react-icons/fa";
import { MdArrowRightAlt, MdStars } from "react-icons/md";
import Specifications from "./Specifications";
import ProductList from "./ProductList";
import FAQ from "./FAQ";
import ProductDetails from "./ProductDetails";
import PriceTable from "./PriceTable";
// Data structure - can be replaced with API calls later
const productData = {
  title: 'iPhone Series 13 pro max',
  variants: {
    color: 'Midnight',
    region: 'International',
    storage: '128-GB',
  },
  specifications: [
    'Display: 6.1" Super Retina XDR OLED',
    'Processor: Apple A15 Bionic',
    'Battery: 3240 mAh, fast & wireless charging',
    'Camera: Dual 12 MP, night mode, Cinematic video',
    'Others: 5G, IP68 water-resistant, MagSafe',
  ],
  status: 'Available',
  sku: 'iPhone-13-saq',
  price: {
    current: '৳1,00,500',
    original: '৳1,00,900',
    discount: 30,
    points: 200,
  },
  storageOptions: [
    { value: '128GB', label: '128GB' },
    { value: '256GB', label: '256GB' },
  ],
  colorOptions: [
    { name: 'Orange', value: 'orange', hex: '#FF6B35' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
    { name: 'Grey', value: 'grey', hex: '#9CA3AF' },
    { name: 'Light Orange', value: 'light-orange', hex: '#FCD34D' },
    { name: 'Light Green', value: 'light-green', hex: '#86EFAC' },
    { name: 'Light Blue', value: 'light-blue', hex: '#60A5FA' },
  ],
  regionOptions: [
    { value: 'Usa', label: 'Usa' },
    { value: 'China', label: 'China' },
    { value: 'International', label: 'International' },
  ],
  warranty: {
    text: '1 Year Apple International Warranty',
    link: 'Check Your Product Warranty Policy',
  },
  delivery: {
    text: 'Standard Delivery (48-72 H)',
    link: 'Check Estimated Shipping Time',
  },
  viewing: 105,
  sold: {
    count: 20,
    days: 4,
  },
  rating: {
    value: 4.2,
    reviews: 100,
  },
  phoneNumber: '09678-664664',
}

export default function ProductPage() {
  const [selectedStorage, setSelectedStorage] = useState('128GB')
  const [selectedColor, setSelectedColor] = useState('orange')
  const [selectedRegion, setSelectedRegion] = useState('International')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  // Calculate filled stars
  const fullStars = Math.floor(productData.rating.value)
  const hasHalfStar = productData.rating.value % 1 >= 0.5

  return (
    <div className="bg-[#f5f5f5]">
      <div className="w-11/12 mx-auto  py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 justify-center">
          {/* Left Column - Product Images */}
         <div className="w-full max-w-[550px] mx-auto">
  <div className="w-full max-h-[673px] h-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
    {/* Main Product Image */}
    <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center aspect-[3/4]">
      {/* Warranty Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-2">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">1</div>
            <div className="text-xs font-semibold leading-tight">
              YEAR<br />WARRANTY
            </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <Image
        src="/images/iphone13.webp"
        alt="iPhone 13"
        fill
        className="object-contain"
      />
    </div>

    {/* Thumbnail Carousel */}
    <div className="relative">
      <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex gap-2 overflow-x-auto px-8 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
  <button
    key={i}
    onClick={() => setSelectedImageIndex(i - 1)}
    // Added 'relative' to the class list below
    className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
      selectedImageIndex === i - 1 ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <Image
      src="/images/iphone13.webp"
      alt={`Thumbnail ${i}`}
      fill
      className="object-contain p-1" // Added a little padding so it doesn't touch the borders
    />
  </button>
))}
      </div>

      <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</div>

          {/* Middle Column - Product Details & Options */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full h-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden">
              {/* Product Title */}
              <h1 className="text-[24px] font-bold text-gray-900 mb-2">{productData.title}</h1>

              {/* Selected Variants */}
              <div className="flex gap-2 rounded-md bg-gray-100 mb-4 flex-wrap">
                <span className="px-3 py-1  text-gray-700 text-sm  font-base">
                  {productData.variants.color}
                </span>
                <span className="px-3 py-1 border-l-2 border-gray-300 pl-2  text-gray-700 text-sm font-base">
                  {productData.variants.region}
                </span>
                <span className="px-3 py-1  border-l-2 border-gray-300 pl-2 text-gray-700 text-sm  font-base">
                  {productData.variants.storage}
                </span>
              </div>

              {/* Key Specifications */}
              <ul className="list-disc list-inside leading-tight space-y-1 mb-4 text-sm text-gray-700">
                {productData.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>

              {/* Status and SKU */}
              <div className="flex bg-gray-100 p-2 rounded-md items-center gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Status: </span>
                  <span className="text-green-600 font-semibold">{productData.status}</span>
                </div>
                <div>
                  <span className="text-gray-600 border-l-2 border-gray-300 pl-2">SKU: </span>
                  <span className="text-gray-700 font-medium">{productData.sku}</span>
                </div>
              </div>

              {/* Price Information */}
              <div className="">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-[26px] font-bold text-orange-600">{productData.price.current}</span>
                  <span className="text-[16px] text-gray-400 line-through">{productData.price.original}</span>

                  <span className="px-3 py-1  bg-[#E7F3EC] text-[#0A8544] text-sm font-medium rounded-2xl">
                    {productData.price.discount}% Off
                  </span>
                  <span className="px-3 py-1 bg-[#FFEFCC] text-[#FFB20B] text-sm font-semibold rounded-2xl">
                    Earn {productData.price.points}-Points
                  </span>
                </div>
              </div>

              {/* Storage Options */}
              <div className="mb-3 flex items-center bg-[#f4f4f4] p-2">
                <div className="block text-sm font-medium text-gray-700 mr-3 ">Storage : </div >
                <div className="flex gap-2">
                  {productData.storageOptions.map((storage) => (
                    <button
                      key={storage.value}
                      onClick={() => setSelectedStorage(storage.value)}
                      className={`px-4 py-1 rounded text-[12px] font-base transition ${selectedStorage === storage.value
                          ? 'bg-[#E5E5E5] text-gray-900'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                      {storage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Options */}
              <div className=" flex bg-[#f4f4f4] items-center p-2 mb-3">
                <div className=" text-sm font-medium text-gray-700 mr-5">Color: </div>
                <div className="flex gap-3">
                  {productData.colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-[24px] h-[24px] rounded-md  border-2 transition ${selectedColor === color.value
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Region Options */}
              <div className="flex bg-[#f4f4f4] items-center p-2 mb-3">
                <div className=" text-sm font-medium text-gray-700 mr-5 ">Region: </div>
                <div className="flex flex-wrap gap-2">
                  {productData.regionOptions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => setSelectedRegion(region.value)}
                      className={`px-4 py-1 rounded text-[12px] font-medium transition ${selectedRegion === region.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-[#E5E5E5] text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4 flex items-center ">
                <div className=" text-sm font-medium text-gray-700 mr-3 ">Quantity:  </div>
                <div className="flex items-center  gap-4">
                  <div className="flex items-center w-[90px] bg-[#f4f4f4] h-[38px] border border-gray-300 rounded overflow-hidden">

                    {/* Minus */}
                    <button
                      onClick={decrementQuantity}
                      className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] bg-orange-500 rounded-full text-white hover:text-black ml-1 flex items-center justify-center  font-semibold  hover:bg-gray-100 transition"
                    >
                      −
                    </button>

                    {/* Quantity */}
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-full h-full bg-[#f4f4f4] text-center text-sm font-medium text-gray-800 focus:outline-none"
                    />

                    {/* Plus */}
                    <button
                      onClick={incrementQuantity}
                      className="w-[42px] h-[13px] text-xs md:text-lg md:w-[42px] md:h-[20px] rounded-full text-white flex bg-orange-500 items-center justify-center  font-semibold  hover:text-black mr-1 hover:bg-gray-100 transition"
                    >
                      +
                    </button>

                  </div>

                  <span className="text-sm text-[#B3D9C5] font-bold">
                    Call For Online Order ({productData.phoneNumber})
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
            <div className="w-full max-h-[773px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
              {/* Warranty Details */}
              <div className="bg-[#F4F4F4] p-2 flex flex-col mb-3 gap-2">
                <div className="flex gap-1 "><FaShieldAlt className="w-5 h-5 text-black" /> <p className="text-sm font-medium text-gray-700 mb-1">{productData.warranty.text}</p></div>
                
                <div className="flex gap-2">
                  <MdArrowRightAlt className="text-orange-500" /> 
                  <a href="#" className="text-sm  text-orange-500 hover:underline">
                  {productData.warranty.link}
                  </a>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-[#F4F4F4] p-2 flex flex-col  items-start gap-2 mb-3">
              <div className="flex  gap-1 " >
 <FaTruck className="w-5 h-5 text-black" />
  <p className="text-sm text-gray-700 font-medium mb-1">{productData.delivery.text}</p>
              </div>
               
                <div className="flex gap-2">
         <MdArrowRightAlt className="text-orange-500" /> 
                  <a href="#" className="text-sm text-orange-500 hover:underline">
                    {productData.delivery.link}
                  </a>
                </div>
              </div>

              {/* Viewer Count */}
              <div className="flex font-medium items-center gap-2 mb-3 text-sm bg-[#F4F4F4] p-4 text-gray-700">
                <FaEye className="w-5 h-5 text-black" />
                <span>{productData.viewing} People are viewing this product</span>
              </div>

              {/* Units Sold */}
              <div className="flex font-medium bg-[#F4F4F4] p-4 mb-3 items-center gap-2 text-sm text-gray-700">
                <FaShoppingBag className="w-5 h-5 text-black" />
                <span>{productData.sold.count} units of this variants sold in the last {productData.sold.days} days</span>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center p-4 mb-3 bg-[#f4f4f4] gap-2 ">

                <div className="flex items-center font-medium text-sm  text-gray-700 mr-3 "><MdStars className="w-5 h-5 text-black mr-2" /> Rating:  </div>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= fullStars) {
                      return <FaStar key={star} className="w-5 h-5 text-orange-500" />
                    } else if (star === fullStars + 1 && hasHalfStar) {
                      return <FaStarHalfAlt key={star} className="w-5 h-5 text-orange-500" />
                    } else {
                      return <FaRegStar key={star} className="w-5 h-5 text-gray-300" />
                    }
                  })}
                </div>

                <span className="text-sm text-gray-700">
                  ({productData.rating.value}) / {productData.rating.reviews}+ Reviews
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
       <Specifications />
       <FAQ />
       </div>

  <div className="w-[28.645vw] max-w-[550px] rounded-xl  min-w-[320px] ">
    <ProductList
       relatedProducts={[
    {
      id: 1,
      name: "Nokia 230 Series Model (2024)",
      price: 1500,
      oldPrice: 1800,
      discount: 20,
      image: "/images/nokia.png",
      available: true,
    },
    {
      id: 2,
      name: "Nokia 230 Series Model (2024)",
      price: 1500,
      oldPrice: 1800,
      discount: 20,
      image: "/images/nokia.png",
      available: true,
    },
    {
      id: 3,
      name: "Nokia 230 Series Model (2024)",
      price: 1500,
      oldPrice: 1800,
      discount: 20,
      image: "/images/nokia.png",
      available: true,
    },
  ]}
  recentlyViewed={[
    {
      id: 4,
      name: "Nokia 230 Series Model (2024)",
      price: 1500,
      oldPrice: 1800,
      discount: 20,
      image: "/images/nokia.png",
      available: true,
    },
    {
      id: 5,
      name: "Nokia 230 Series Model (2024)",
      price: 1500,
      oldPrice: 1800,
      discount: 20,
      image: "/images/nokia.png",
      available: true,
    },
  ]}
/>
  </div>
</div>
{/* Product Details */}
<div className="bg-white w-11/12 mx-auto p-8">
<div>
  <ProductDetails />
</div>
<div className="">
      {/* Using defaults */}
      <PriceTable />

      {/* Or passing custom data later */}
      {/* <PriceTable categoryName="Samsung" data={samsungData} /> */}
    </div>
    </div>
   
    </div>
  )
}