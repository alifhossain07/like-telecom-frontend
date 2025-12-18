'use client'

import { useState } from 'react'

// Data structure - can be replaced with API calls later
const productData = {
  title: 'iPhone Series 13 pro max',
  variants: {
    color: 'Midnight',
    region: 'Internationl',
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
  sku: 'iPhone 13internaitonal',
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              {/* Main Product Image */}
              <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
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
                
                {/* Main Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                  <div className="text-8xl">📱</div>
                </div>
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
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                        selectedImageIndex === i - 1
                          ? 'border-orange-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                        <div className="text-2xl">📱</div>
                      </div>
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
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {/* Product Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{productData.title}</h1>

              {/* Selected Variants */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
                  {productData.variants.color}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
                  {productData.variants.region}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
                  {productData.variants.storage}
                </span>
              </div>

              {/* Key Specifications */}
              <ul className="list-disc list-inside space-y-1 mb-4 text-sm text-gray-700">
                {productData.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>

              {/* Status and SKU */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Status: </span>
                  <span className="text-green-600 font-semibold">{productData.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">SKU: </span>
                  <span className="text-gray-700 font-medium">{productData.sku}</span>
                </div>
              </div>

              {/* Price Information */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-orange-600">{productData.price.current}</span>
                  <span className="text-xl text-gray-400 line-through">{productData.price.original}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded">
                    {productData.price.discount}% Off
                  </span>
                  <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded">
                    Earn {productData.price.points}-Points
                  </span>
                </div>
              </div>

              {/* Storage Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                <div className="flex gap-2">
                  {productData.storageOptions.map((storage) => (
                    <button
                      key={storage.value}
                      onClick={() => setSelectedStorage(storage.value)}
                      className={`px-4 py-2 rounded text-sm font-medium transition ${
                        selectedStorage === storage.value
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {storage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-3">
                  {productData.colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === color.value
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <div className="flex gap-2">
                  {productData.regionOptions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => setSelectedRegion(region.value)}
                      className={`px-4 py-2 rounded text-sm font-medium transition ${
                        selectedRegion === region.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 font-semibold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="1"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Call For Online Order ({productData.phoneNumber})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <button className="flex-1 bg-gray-800 text-white px-6 py-3 rounded font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Messaging Options */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.404-.405.765-.674 1.08-.27.315-.58.58-.93.795-.35.215-.73.38-1.14.495-.41.115-.84.173-1.29.173-.45 0-.88-.058-1.29-.173-.41-.115-.79-.28-1.14-.495-.35-.215-.66-.48-.93-.795-.27-.315-.495-.676-.674-1.08-.18-.404-.27-.83-.27-1.278 0-.448.09-.874.27-1.278.18-.404.405-.765.674-1.08.27-.315.58-.58.93-.795.35-.215.73-.38 1.14-.495.41-.115.84-.173 1.29-.173.45 0 .88.058 1.29.173.41.115.79.28 1.14.495.35.215.66.48.93.795.27.315.495.676.674 1.08.18.404.27.83.27 1.278 0 .448-.09.874-.27 1.278z"/>
                  </svg>
                  Via Messenger
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Via Whats app
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
              {/* Warranty Details */}
              <div>
                <p className="text-sm text-gray-700 mb-1">{productData.warranty.text}</p>
                <a href="#" className="text-sm text-orange-500 hover:underline">
                  {productData.warranty.link}
                </a>
              </div>

              {/* Delivery Information */}
              <div>
                <p className="text-sm text-gray-700 mb-1">{productData.delivery.text}</p>
                <a href="#" className="text-sm text-orange-500 hover:underline">
                  {productData.delivery.link}
                </a>
              </div>

              {/* Viewer Count */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{productData.viewing} People are viewing this product</span>
              </div>

              {/* Units Sold */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{productData.sold.count} units of this variants sold in the last {productData.sold.days} days</span>
              </div>

              {/* Rating and Reviews */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      if (star <= fullStars) {
                        return (
                          <svg key={star} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )
                      } else if (star === fullStars + 1 && hasHalfStar) {
                        return (
                          <div key={star} className="relative w-5 h-5">
                            <svg className="absolute w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <svg className="absolute w-5 h-5 text-orange-500 overflow-hidden" style={{ width: '50%' }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )
                      } else {
                        return (
                          <svg key={star} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )
                      }
                    })}
                  </div>
                  <span className="text-sm text-gray-700">
                    ({productData.rating.value}) / {productData.rating.reviews}+ Reviews
                  </span>
                </div>
              </div>

              {/* Secondary Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Add Compare
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add Wishlist
                </button>
              </div>

              {/* Payment Plans */}
              <button className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                EMI-View Plans
              </button>

              {/* Payment & Shipping Info */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Shipping & Charge</span>
                </div>
              </div>

              {/* Share Options */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-2">Share:</p>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition">
                    <span className="text-blue-600 font-bold text-xs">f</span>
                  </a>
                  <a href="#" className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition">
                    <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}