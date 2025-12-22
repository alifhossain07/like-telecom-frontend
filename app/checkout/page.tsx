"use client";
import axios from "axios";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";
// ------------------------- Types -------------------------
interface CartItem {
  id: string | number;
  name: string;
  img: string;
  price: number;
  oldPrice: number;
  qty: number;
  variant?: string;
  variantImage?: string;
}

interface CheckoutFormData {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  // shipping removed, now handled by deliveryMethod
  payment: "online" | "cod";
  agreeTerms: boolean;
  promoCode?: string;
  districtId?: number | null;
  districtName?: string;
  stateId?: number | null;
  stateName?: string;
  deliveryMethod: "inside" | "outside" | "shop_pickup";
  pickupStore?: string;
}

interface CouponData {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order?: number;
  max_discount?: number;
  expiry_date?: string;
}

interface PickupStore {
  id: number;
  staff_id: number | null;
  name: string;
  address: string;
  phone: string;
  pick_up_status: number;
  cash_on_pickup_status: number | null;
}

// ------------------------- Yup Schema -------------------------
const schema: yup.ObjectSchema<CheckoutFormData> = yup.object({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^\d{11}$/, "Mobile must be 11 digits")
    .required("Mobile number is required"),
  email: yup.string().email("Invalid email").optional(),
  address: yup.string().required("Address is required"),
  districtId: yup.number().typeError("District is required").required("District is required"),
  districtName: yup.string().optional(),
  stateId: yup.number().typeError("Upazila/Thana is required").required("Upazila/Thana is required"),
  stateName: yup.string().optional(),
  deliveryMethod: yup
    .mixed<CheckoutFormData["deliveryMethod"]>()
    .oneOf(["inside", "outside", "shop_pickup"], "Select a delivery method")
    .required("Delivery method is required"),
  pickupStore: yup.string().when("deliveryMethod", {
    is: "shop_pickup",
    then: (schema) => schema.required("Pickup store is required"),
    otherwise: (schema) => schema.optional(),
  }),
  payment: yup
    .mixed<CheckoutFormData["payment"]>()
    .required("Payment method is required"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must accept terms")
    .required("You must accept terms"),
  promoCode: yup.string().optional(),
});
// ------------------------- Checkout Page -------------------------
const CheckoutPage: React.FC = () => {
  const { cart, selectedItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const router = useRouter();

  // Filter selected items
  const selectedCart: CartItem[] = cart.filter((item) =>
    selectedItems.includes(item.id)
  );

  // Totals
  // Subtotal should reflect pre-discount sum; discount reflects savings
  const subtotal = selectedCart.reduce(
    (acc, item) => acc + (Number(item.oldPrice ?? item.price) * item.qty),
    0
  );
  const discount = selectedCart.reduce(
    (acc, item) => acc + Math.max(0, Number(item.oldPrice) - Number(item.price)) * item.qty,
    0
  );

  // ------------------------- React Hook Form -------------------------
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      deliveryMethod: "inside",
      payment: "cod",
      agreeTerms: true,
      promoCode: "",
      districtId: null,
      districtName: "",
      stateId: null,
      stateName: "",
      pickupStore: "",
    },
  });

  // ------------------------- Districts & States (Two-step selection) -------------------------
  type DistrictOption = { id: number; name: string; code: string; status: number };
  type StateOption = { id: number; country_id: number; name: string };
  
  // Districts state
  const [districts, setDistricts] = React.useState<DistrictOption[]>([]);
  const [districtQuery, setDistrictQuery] = React.useState<string>("");
  const [districtsLoading, setDistrictsLoading] = React.useState<boolean>(false);
  const [districtOpen, setDistrictOpen] = React.useState<boolean>(false);
  const districtDebounceRef = React.useRef<number | undefined>(undefined);
  
  // States/Upazilas state
  const [states, setStates] = React.useState<StateOption[]>([]);
  const [stateQuery, setStateQuery] = React.useState<string>("");
  const [statesLoading, setStatesLoading] = React.useState<boolean>(false);
  const [stateOpen, setStateOpen] = React.useState<boolean>(false);
  const stateDebounceRef = React.useRef<number | undefined>(undefined);
  
  const selectedDistrictId = watch("districtId");

  // Filter districts locally
  const filteredDistricts = React.useMemo(() => {
    const q = districtQuery.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.name.toLowerCase().includes(q));
  }, [districtQuery, districts]);

  // Filter states locally
  const filteredStates = React.useMemo(() => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return states;
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [stateQuery, states]);

  // Load districts on mount - fetches from /api/countries which calls like.test/api/v2/countries
  React.useEffect(() => {
    let cancelled = false;
    const loadDistricts = async () => {
      try {
        setDistrictsLoading(true);
        const res = await fetch("/api/countries", { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch districts:", res.status, res.statusText);
          if (!cancelled) {
            setDistricts([]);
          }
          return;
        }
        const json = await res.json();
        // API returns {data: [...], success: true, status: 200}
        // Extract the data array which contains all districts
        const list: DistrictOption[] = Array.isArray(json?.data) 
          ? json.data 
          : Array.isArray(json) 
          ? json 
          : [];
        if (!cancelled) {
          setDistricts(list);
          console.log(`✅ Districts loaded successfully: ${list.length} districts from API`);
          if (list.length > 0) {
            console.log("Sample districts:", list.slice(0, 5).map(d => d.name));
          }
        }
      } catch (error) {
        console.error("❌ Error loading districts:", error);
        if (!cancelled) {
          setDistricts([]);
        }
      } finally {
        if (!cancelled) setDistrictsLoading(false);
      }
    };
    loadDistricts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load states when district is selected
  React.useEffect(() => {
    if (!selectedDistrictId) {
      setStates([]);
      setValue("stateId", null);
      setValue("stateName", "");
      setStateQuery("");
      return;
    }

    let cancelled = false;
    const loadStates = async () => {
      try {
        setStatesLoading(true);
        const res = await fetch(`/api/states-by-country/${selectedDistrictId}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const list: StateOption[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setStates(list);
      } catch {
        // ignore
      } finally {
        setStatesLoading(false);
      }
    };
    loadStates();
    return () => {
      cancelled = true;
    };
  }, [selectedDistrictId, setValue]);

  // Fetch state suggestions with debounce
  const fetchStateSuggestions = React.useCallback(async (districtId: number, q: string) => {
    if (!q || !districtId) {
      return;
    }
    try {
      setStatesLoading(true);
      const res = await fetch(`/api/states-by-country/${districtId}?name=${encodeURIComponent(q)}`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const list: StateOption[] = Array.isArray(json?.data) ? json.data : [];
      setStates(list);
    } catch {
      // ignore
    } finally {
      setStatesLoading(false);
    }
  }, []);

  const handleDistrictInputChange = (val: string) => {
    setDistrictQuery(val);
    setDistrictOpen(true);
  };

  const handleDistrictFocus = () => {
    setDistrictOpen(true);
    // When clicking on field, clear query to show all districts (unless a district is already selected)
    if (!selectedDistrictId) {
      setDistrictQuery("");
    }
  };

  const handleSelectDistrict = (district: DistrictOption) => {
    setDistrictQuery(district.name);
    setValue("districtId", district.id, { shouldValidate: true });
    setValue("districtName", district.name);
    // Reset state when district changes
    setValue("stateId", null);
    setValue("stateName", "");
    setStateQuery("");
    setDistrictOpen(false);
  };

  const handleStateInputChange = (val: string) => {
    setStateQuery(val);
    setStateOpen(true);
    // Debounce suggestions
    if (stateDebounceRef.current) window.clearTimeout(stateDebounceRef.current);
    if (selectedDistrictId) {
      stateDebounceRef.current = window.setTimeout(() => fetchStateSuggestions(selectedDistrictId, val.trim()), 250);
    }
  };

  const handleSelectState = (state: StateOption) => {
    setStateQuery(state.name);
    setValue("stateId", state.id, { shouldValidate: true });
    setValue("stateName", state.name);
    setStateOpen(false);
  };

  const deliveryMethod = watch("deliveryMethod");
  
  // ------------------------- Pickup Stores -------------------------
  const [pickupStores, setPickupStores] = React.useState<PickupStore[]>([]);
  const [pickupStoresLoading, setPickupStoresLoading] = React.useState<boolean>(false);
  const [pickupStoreOpen, setPickupStoreOpen] = React.useState<boolean>(false);
  const selectedPickupStoreId = watch("pickupStore");

  // Load pickup stores when shop_pickup is selected
  React.useEffect(() => {
    if (deliveryMethod !== "shop_pickup") {
      setPickupStores([]);
      setValue("pickupStore", "");
      setPickupStoreOpen(false);
      return;
    }

    let cancelled = false;
    const loadPickupStores = async () => {
      try {
        setPickupStoresLoading(true);
        const res = await fetch("/api/pickup-list", { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch pickup stores:", res.status, res.statusText);
          if (!cancelled) {
            setPickupStores([]);
          }
          return;
        }
        const json = await res.json();
        // API returns {data: [...], success: true, status: 200}
        const list: PickupStore[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) {
          setPickupStores(list);
          console.log(`✅ Pickup stores loaded: ${list.length} stores`);
        }
      } catch (error) {
        console.error("❌ Error loading pickup stores:", error);
        if (!cancelled) {
          setPickupStores([]);
        }
      } finally {
        if (!cancelled) setPickupStoresLoading(false);
      }
    };
    loadPickupStores();
    return () => {
      cancelled = true;
    };
  }, [deliveryMethod, setValue]);

  const handleSelectPickupStore = (store: PickupStore) => {
    setValue("pickupStore", String(store.id), { shouldValidate: true });
    setPickupStoreOpen(false);
  };

  // Dynamic shipping config
  const [shippingConfig, setShippingConfig] = React.useState<{
    shipping_cost_inside_dhaka: number;
    shipping_cost_outside_dhaka: number;
    free_shipping_min_amount: number;
    currency_symbol?: string;
    currency_code?: string;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/shipping-config", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data || json; // support either {result,data} or direct
        if (!cancelled && data) setShippingConfig(data);
      } catch {
        // ignore
      }
    };
    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  // Shipping charges (dynamic from config)
  const insideDhaka = shippingConfig?.shipping_cost_inside_dhaka ?? 60;
  const outsideDhaka = shippingConfig?.shipping_cost_outside_dhaka ?? 140;
  const freeMin = shippingConfig?.free_shipping_min_amount ?? 0;
  const currencySymbol = shippingConfig?.currency_symbol ?? "৳";


  let deliveryCharge = 0;
  if (deliveryMethod === "inside") deliveryCharge = insideDhaka;
  else if (deliveryMethod === "outside") deliveryCharge = outsideDhaka;
  else if (deliveryMethod === "shop_pickup") deliveryCharge = 0;

  const merchandiseTotal = subtotal - discount;
  if (freeMin > 0 && merchandiseTotal >= freeMin && deliveryMethod !== "shop_pickup") {
    deliveryCharge = 0;
  }

  // ------------------------- Promo Code States & Logic -------------------------
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);
  const [couponData, setCouponData] = React.useState<CouponData | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  // Real API promo validation
 const validatePromoCode = async (code: string) => {
  try {
    setIsValidatingPromo(true);
    const response = await axios.post<{ result: boolean; data?: CouponData; message?: string }>("/api/coupon-apply", {
      code: code.toUpperCase(),
    });

    if (response.data.result) {
      setCouponData(response.data.data!); // "!" because data exists if result is true
      setAppliedPromo(code.toUpperCase());
      toast.success(`Promo code "${code.toUpperCase()}" applied! 🎉`, {
        style: {
          background: "#22c55e",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
      return true;
    } else {
      throw new Error(response.data.message || "Invalid coupon");
    }
  } catch (error: unknown) {
    setAppliedPromo(null);
    setCouponData(null);
    setPromoDiscount(0);

    if (axios.isAxiosError(error)) {
      // Axios-specific error
      toast.error(error.response?.data?.message || "Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    } else if (error instanceof Error) {
      // Regular JS error
      toast.error(error.message || "Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    } else {
      // Fallback
      toast.error("Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    }

    return false;
  } finally {
    setIsValidatingPromo(false);
  }
};

  const handleApplyPromo = async () => {
    const code = watch("promoCode")?.toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a promo code ❌");
      return;
    }

    await validatePromoCode(code);
  };

  // Calculate promo discount based on API response
  React.useEffect(() => {
    if (couponData) {
      const baseAmount = subtotal - discount;
      let discountAmount = 0;
      
      if (couponData.type === "percentage") {
        discountAmount = baseAmount * (couponData.value / 100);
      } else {
        discountAmount = couponData.value;
      }
      
      setPromoDiscount(Math.min(discountAmount, baseAmount)); // Don't exceed base amount
    } else {
      setPromoDiscount(0);
    }
  }, [couponData, subtotal, discount]);

  const effectiveDelivery = deliveryCharge;
  const total = subtotal - discount + effectiveDelivery - promoDiscount;

  // ------------------------- Payment Modal -------------------------
  // Payment modal removed
  // Online payment state (commented for future use)
  // const [paymentData, setPaymentData] = React.useState<CheckoutFormData | null>(null);
  // const [selectedPaymentMethod, setSelectedPaymentMethod] =
  //   React.useState<"visa" | "mastercard" | "bkash" | "nagad">("visa");
  // const [paymentNumber, setPaymentNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmOrder = (data: CheckoutFormData) => {
    // Clear promo on new order
    setAppliedPromo(null);
    setCouponData(null);
    setPromoDiscount(0);

    if (data.payment === "cod") {
      submitOrder(data);
    } else {
      toast.error("Online payment is coming soon. Please use Cash On Delivery.");
    }
  };

  const submitOrder = async (data: CheckoutFormData) => {
    if (selectedCart.length === 0) {
      toast.error("Your cart is empty ❌");
      return;
    }

    // Build payload exactly like backend expects
    const addressParts = [
      data.address?.trim(),
      data.stateName?.trim(),
      data.districtName?.trim()
    ].filter(Boolean);
    const composedAddress = addressParts.join(", ");
    let shipping_zone = null;
    if (data.deliveryMethod === "inside") shipping_zone = "insideDhaka";
    else if (data.deliveryMethod === "outside") shipping_zone = "outsideDhaka";
    const payload = {
      customer: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        address: composedAddress,
        country_id: data.districtId ?? null,
        state_id: data.stateId ?? null,
        city_id: null,
        area_id: null,
        postal_code: null,
      },
      items: selectedCart.map((item) => ({
        id: Number(item.id),
        qty: Number(item.qty),
        variant: item.variant || null,
        referral_code: null,
      })),
      shipping_method:
        data.deliveryMethod === "inside" || data.deliveryMethod === "outside"
          ? "home_delivery"
          : "pickup_point",
      shipping_zone: data.deliveryMethod === "shop_pickup" ? null : shipping_zone,
      payment_method: "Cash on Delivery",
      payment_number: null,
      promo_code: appliedPromo || null,
      note: "",
      pickup_point_id: data.deliveryMethod === "shop_pickup" ? (data.pickupStore ? Number(data.pickupStore) : null) : null,
      carrier_id: null,
    };

    try {
      setIsLoading(true);
      const response = await axios.post("/api/orders", payload);

      if (response.data.success && response.data.data?.result) {
        toast.success(response.data.data.message || "Order placed successfully! 🎉");
        try {
          if (typeof window !== "undefined") {
            const backendData = response.data.data;
            const transactionId =
              backendData?.orders?.[0]?.code ||
              backendData?.order?.code ||
              backendData?.order_code ||
              backendData?.code ||
              String(backendData?.combined_order_id || "");

            const itemsForAnalytics = selectedCart.map((item) => ({
              item_id: String(item.id),
              item_name: item.name,
              price: item.price,
              quantity: item.qty,
              item_variant: item.variant || "",
              item_brand: "",
              item_category: "",
            }));

            const shipping = effectiveDelivery;
            const value = subtotal - discount - promoDiscount + shipping;

           window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: transactionId,
    affiliation: "Online Store",
    value,
    tax: 0,
    shipping,
    currency: "BDT",
    coupon: appliedPromo || "",
    items: itemsForAnalytics,
  },
});

            // Persist minimal order summary for order-complete page
            let shippingMethodLabel = "";
            if (data.deliveryMethod === "inside") shippingMethodLabel = "Inside Dhaka – Home Delivery";
            else if (data.deliveryMethod === "outside") shippingMethodLabel = "Outside Dhaka – Home Delivery";
            else if (data.deliveryMethod === "shop_pickup") shippingMethodLabel = "Shop Pickup";

            const orderSummary = {
              orderId: transactionId || null,
              customer: {
                name: data.name,
                mobile: data.mobile,
                email: data.email || "",
                address: composedAddress,
              },
              items: selectedCart.map((item) => {
                const itemData = {
                  id: item.id,
                  name: item.name,
                  qty: item.qty,
                  price: item.price,
                  variant: item.variant || null,
                };
                // Debug: log variant info
                if (item.variant) {
                  console.log(`Item ${item.name} has variant:`, item.variant);
                }
                return itemData;
              }),
              shipping: {
                method: data.deliveryMethod,
                methodLabel: shippingMethodLabel,
                charge: effectiveDelivery,
              },
              totals: {
                subtotal,
                discount,
                deliveryCharge: effectiveDelivery,
                promoDiscount,
                total: subtotal - discount + effectiveDelivery - promoDiscount,
              },
            };

            try {
              sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));
            } catch {}

            // Navigate with orderId when available
            const nextHref = `/checkout/ordercomplete${transactionId ? `?orderId=${encodeURIComponent(transactionId)}` : ""}`;
            // Clear and navigate after persisting
            clearCart();
            router.push(nextHref);
            return;
          }
        } catch (e) {
          console.error("Failed to push purchase event", e);
        }
        // Fallback navigation if window/data persistence failed
        clearCart();
        router.push("/checkout/ordercomplete");
      } else {
        toast.error(response.data.message || "Failed to place order ❌");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Order submit error:", error.response || error);
        toast.error(
          error.response?.data?.message || "Something went wrong while placing the order ❌"
        );
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong while placing the order ❌");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleModalPaymentConfirm = async () => {
  //   if (!paymentData) return;
  //   try {
  //     setIsLoading(true);
  //     await submitOrder(paymentData);
  //     setIsLoading(false);
  //     setShowPaymentModal(false);
  //     router.push("/checkout/ordercomplete");
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //     toast.error("Something went wrong ❌");
  //   }
  // };

  // const handleModalCancel = () => {
  //   setShowPaymentModal(false);
  //   setPaymentData(null);
  // };

  // ------------------------- JSX -------------------------
  return (
    <div className="w-11/12 mx-auto my-10 min-h-[50vh]">
      <h1 className="text-2xl  md:text-3xl font-bold mb-6">Shipping Information</h1>
      <form onSubmit={handleSubmit(handleConfirmOrder)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* In Your Cart */}
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">In Your Cart</h2>
          </div>
          {selectedCart.length === 0 ? (
            <p className="text-gray-500 text-sm">No items selected.</p>
          ) : (
            selectedCart.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative">
                <div className="md:w-28 md:h-28 h-20 w-20 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm md:text-lg">{item.name}</h3>
                  {item.variant && (
  <p className="text-xs text-gray-500 mt-1">
    {item.variant}
  </p>
)}
                  <div className="font-semibold text-orange-600 text-sm md:text-lg mt-1">
                    ৳{item.price}
                    <span className="line-through text-gray-400 ml-2 text-xs">৳{item.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm md:text-sm">
                    <span className="font-medium">QTY :</span>
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 text-lg"
                >
                  <RiDeleteBin6Line className="text-xl mr-2 mb-2" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Customer Info + Shipping */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">Customer Information</h2>
            <div className="flex flex-col gap-3">
              <label>Your Name*</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-2 mb-1 rounded"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <label>Mobile*</label>
              <input
                type="text"
                placeholder="019*******"
                className="border p-2 mb-1 rounded"
                {...register("mobile")}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              <label>E-mail (optional)</label>
              <input
                type="email"
                placeholder="@email"
                className="border p-2 mb-1 rounded"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              
              {/* District & State Selection */}
              <div className="mb-2 gap-4 flex flex-row">
                <div className="flex-1">
                  <label>District*</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select or search district"
                      className="border p-2 rounded w-full mb-1"
                      value={districtQuery}
                      onChange={(e) => handleDistrictInputChange(e.target.value)}
                      onFocus={handleDistrictFocus}
                      onBlur={() => setTimeout(() => setDistrictOpen(false), 150)}
                    />
                    {/* Hidden fields for RHF */}
                    <input type="hidden" {...register("districtId")} />
                    <input type="hidden" {...register("districtName")} />

                    {districtOpen && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {districtsLoading ? (
                          <div className="p-2 text-sm text-gray-500">Loading districts...</div>
                        ) : districts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">No districts available. Please try again.</div>
                        ) : filteredDistricts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No districts found matching "{districtQuery}"
                          </div>
                        ) : (
                          filteredDistricts.map((district) => (
                            <button
                              type="button"
                              key={district.id}
                              className="w-full text-left px-3 py-2 hover:bg-orange-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectDistrict(district)}
                            >
                              <span className="font-medium text-gray-800">{district.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {errors.districtId && (
                    <p className="text-red-500 text-sm">{String(errors.districtId.message)}</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <label>Upazila/Thana*</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedDistrictId ? "Select or search upazila/thana" : "Select district first"}
                      className="border p-2 rounded w-full mb-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={stateQuery}
                      onChange={(e) => handleStateInputChange(e.target.value)}
                      onFocus={() => selectedDistrictId && setStateOpen(true)}
                      onBlur={() => setTimeout(() => setStateOpen(false), 150)}
                      disabled={!selectedDistrictId}
                    />
                    {/* Hidden fields for RHF */}
                    <input type="hidden" {...register("stateId")} />
                    <input type="hidden" {...register("stateName")} />

                    {stateOpen && selectedDistrictId && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {statesLoading && (
                          <div className="p-2 text-sm text-gray-500">Loading...</div>
                        )}
                        {!statesLoading && filteredStates.length === 0 && (
                          <div className="p-2 text-sm text-gray-500">No upazilas/thanas found</div>
                        )}
                        {!statesLoading && filteredStates.map((state) => (
                          <button
                            type="button"
                            key={state.id}
                            className="w-full text-left px-3 py-2 hover:bg-orange-50"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectState(state)}
                          >
                            <span className="font-medium text-gray-800">{state.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.stateId && (
                    <p className="text-red-500 text-sm">{String(errors.stateId.message)}</p>
                  )}
                </div>
              </div>
              
              <label>Address*</label>
              <input
                type="text"
                placeholder="Delivery address"
                className="border p-2 mb-1 rounded"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
  <h2 className="text-lg font-semibold mb-4">Select a Payment Method</h2>

  <Controller
    name="payment"
    control={control}
    defaultValue="cod" // Default selection
    render={({ field }) => (
      <>
        {/* Dropdown for payment selection */}
        <select
          {...field}
          className="w-full border rounded-md p-2 text-lg cursor-pointer"
        >
          <option value="cod"> <FaMoneyBillWave className="inline mr-2" /> Cash On Delivery</option>
          {/* <option value="online">Online Payment</option> */}
        </select>

        {/* Online payment logos (hidden for now, but ready for future) */}
        {/* {field.value === "online" && (
          <div className="mt-4 gap-2 mb-5 flex flex-col">
            <h1 className="text-[#8f8f8f] text-sm">We Accept</h1>
            <div className="flex items-center gap-2">
              <Image src="/images/visa.png" alt="Visa" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
              <Image src="/images/mastercard.png" alt="Mastercard" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
              <Image src="/images/bkash.png" alt="bKash" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
              <Image src="/images/nagad.png" alt="Nagad" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
            </div>
          </div>
        )} */}

        {errors.payment && (
          <p className="text-red-500 text-sm mt-2">{errors.payment.message}</p>
        )}
      </>
    )}
  />
          <div className="flex flex-col md:flex-row gap-4 mt-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Select a delivery method*</label>
              <select
                className="border p-2 rounded w-full cursor-pointer"
                {...register("deliveryMethod")}
              >
                <option value="inside">Inside Dhaka – Home Delivery ({currencySymbol} {insideDhaka.toLocaleString()})</option>
                <option value="outside">Outside Dhaka – Home Delivery ({currencySymbol} {outsideDhaka.toLocaleString()})</option>
                <option value="shop_pickup">Shop Pickup (No Delivery Charge)</option>
              </select>
              {errors.deliveryMethod && (
                <p className="text-red-500 text-sm">{errors.deliveryMethod.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Choose a pickup store*</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={deliveryMethod === "shop_pickup" ? "Select pickup store" : "Select delivery method first"}
                  className="border p-2 rounded w-full mb-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={selectedPickupStoreId ? pickupStores.find(s => String(s.id) === selectedPickupStoreId)?.name || "" : ""}
                  onFocus={() => deliveryMethod === "shop_pickup" && setPickupStoreOpen(true)}
                  onBlur={() => setTimeout(() => setPickupStoreOpen(false), 150)}
                  readOnly
                  disabled={deliveryMethod !== "shop_pickup"}
                />
                {/* Hidden field for RHF */}
                <input type="hidden" {...register("pickupStore")} />

                {pickupStoreOpen && deliveryMethod === "shop_pickup" && (
                  <div className="absolute z-20 w-full max-h-64 overflow-auto bg-white border rounded shadow mt-1">
                    {pickupStoresLoading ? (
                      <div className="p-2 text-sm text-gray-500">Loading stores...</div>
                    ) : pickupStores.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No pickup stores available</div>
                    ) : (
                      pickupStores.map((store) => (
                        <button
                          type="button"
                          key={store.id}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 border-b last:border-b-0 transition-colors"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectPickupStore(store)}
                        >
                          <div className="text-xs text-gray-700 truncate">
                            <span className="font-semibold">{store.name}</span>
                            <span className="mx-1">-</span>
                            <span>{store.address}</span>
                            <span className="mx-1">-</span>
                            <span className="truncate">{store.phone}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.pickupStore && (
                <p className="text-red-500 text-sm">{errors.pickupStore.message}</p>
              )}
            </div>
          </div>
<label className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
    <input type="checkbox" {...register("agreeTerms")} className="shrink-0" />
    <span className="flex-1">
      I have read & agree to the{" "}
      <span className="text-orange-500">Terms & Conditions, Privacy Policy</span> and{" "}
      <span className="text-orange-500">Return Policy</span>.
    </span>
  </label>
  {errors.agreeTerms && (
    <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
  )}
          </div>
  
        {/* Shipping Method */}

          {/* Shipping Method removed, now handled by delivery method dropdown */}
        </div>

        
        <div className="flex flex-col gap-6">
          


          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            {/* <button className="bg-orange-500 text-white px-4 py-2 mb-4">Validate GP Star</button> */}
            <h1 className="text-2xl mb-4 font-semibold">Promo Code</h1>
            <input
              type="text"
              className="border p-2 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder="Coupon Code"
            />
            {/* <input
              type="text"
              className="border p-2 mt-4 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder="Enter Points Here "
            /> */}
            <div className="cursor-pointer flex justify-end items-center">
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-300 duration-300 mt-2 disabled:opacity-50"
              >
                {isValidatingPromo ? "Applying..." : "Apply"}
              </button>
            </div>
            {appliedPromo && couponData && (
              <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-sm">
                ✅ {appliedPromo} applied! {couponData.type === "percentage" ? `${couponData.value}%` : `৳${couponData.value}`} off
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">In Your Order Summary</h2>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Sub Total :</span>
              <span>৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Delivery Charge :</span>
              <span>৳ {effectiveDelivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Discount :</span>
              <span>৳ {discount.toLocaleString()}</span>
            </div>
            {appliedPromo && promoDiscount > 0 && (
              <div className="flex justify-between md:text-lg text-base mb-2 text-green-600 font-medium">
                <span>Promo Discount ({appliedPromo}) :</span>
                <span>-৳ {promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex bg-[#f4f4f4] py-4 px-2 justify-between font-semibold text-orange-600 text-lg md:text-xl mt-4">
              <span>Total Amount :</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              className={`w-full bg-orange-500 text-white py-3 rounded-full font-semibold text-center mt-4 ${
                !isValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </form>

      {/* ------------------------- Payment Modal ------------------------- */}
      {/* Online payment modal removed. Future implementation can be added here. */}
    </div>
  );
};

export default CheckoutPage;
