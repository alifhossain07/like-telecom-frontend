"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type CardProps = {
  icon: string;
  title: string;
  text: string | string[];
};

type ContactPageData = {
  id: number;
  title: string;
  slug: string;
  description: string;
  form_title: string;
  form_description: string;
  submit_button_text: string;
  support_title: string;
  support_content: string;
  accessibility_title: string;
  accessibility_content: string;
  feedback_title: string;
  feedback_content: string;
  feedback_button_text: string;
  address_label: string;
  address: string;
  address_icon: string;
  phone_label: string;
  phone: string;
  phone_icon: string;
  email_label: string;
  email: string;
  email_icon: string;
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  keywords: string;
};

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch contact page data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch("/api/contact/page", { cache: "no-store" });
        const json = await res.json();

        if (json.result && json.data) {
          setPageData(json.data);
        }
      } catch (error) {
        console.error("Failed to load contact page data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/contact/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        toast.success(data.message || "Message sent successfully! 🎉");
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          content: "",
        });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="w-11/12 mx-auto my-10">
        <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data if API fails
  const contactData = pageData || {
    form_title: "Get in touch",
    form_description: "Have an inquiry or some feedback for us? Fill out the form below to contact our team.",
    submit_button_text: "Send",
    support_title: "We Support You 24/7",
    support_content: "YES, We Are Hearing You! To share any information or suggestions you may have with representatives.",
    accessibility_title: "Accessibility",
    accessibility_content: "We are committed to ensuring our website is accessible to all users.",
    feedback_title: "Feedback & Complaints",
    feedback_content: "If you have any feedback or complaints, feel free to fill out our contact form.",
    feedback_button_text: "Click here to submit complain & feedback",
    address_label: "Office Address",
    address: "",
    address_icon: "/images/location.png",
    phone_label: "Support Number",
    phone: "",
    phone_icon: "/images/phones.png",
    email_label: "Support E-mail",
    email: "",
    email_icon: "/images/mail.png",
  };

  // Parse address to handle line breaks
  const addressLines = contactData.address
    ? contactData.address.split(/\r\n|\n|\r/).filter((line) => line.trim())
    : [];

   
  return (
    <div className="w-11/12 mx-auto my-10">

      {/* ============================
          CONTACT FORM SECTION
      ============================= */}
      <div className="bg-white flex justify-center rounded-xl p-5 md:p-6 lg:p-8">
        <div className="w-full max-w-[1550px] mx-auto">
          <div
            className="
              grid 
              grid-cols-1 
              xl:grid-cols-12
              gap-10
            "
          >
          {/* FORM SIDE */}
          <div className="
            bg-[#f4f4f4]
            rounded-xl
            px-6 py-10 
            w-full
            xl:col-span-7
            flex flex-col
          ">
            <h1 className="text-3xl md:text-4xl font-semibold text-orange-500 mb-3">
              {contactData.form_title}
            </h1>

            <p className="text-base text-black leading-relaxed mb-6 w-full md:w-10/12">
              {contactData.form_description}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
              {/* NAME */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-lg text-[#434343] font-medium">Your E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="flex-grow flex flex-col">
                <label className="text-lg text-[#434343] font-medium">
                  Your Message *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full border rounded-md mt-1 p-3 focus:outline-none resize-none h-40 md:h-full"
                  disabled={isLoading}
                  required
                ></textarea>
              </div>

              {/* SEND BUTTON */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 text-white px-6 py-3 rounded-md text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                >
                  {isLoading ? "Sending..." : contactData.submit_button_text}
                </button>
              </div>
            </form>
          </div>

          {/* INFO SECTIONS SIDE */}
          <div className="
            bg-[#f4f4f4]
            rounded-xl 
            w-full 
            px-6 py-10
            h-auto
            xl:col-span-5
            flex flex-col
            gap-8
            overflow-y-auto
          ">
            {/* We Support You 24/7 Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#434343] mb-4">
                {contactData.support_title}
              </h2>
              <p className="text-base text-[#434343] leading-relaxed">
                {contactData.support_content}
              </p>
            </div>

            {/* Accessibility Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#434343] mb-4">
                {contactData.accessibility_title}
              </h2>
              <p className="text-base text-[#434343] leading-relaxed">
                {contactData.accessibility_content}
              </p>
            </div>

            {/* Feedback & Complaints Section */}
            <div className="flex-grow flex flex-col justify-end">
              <h2 className="text-2xl md:text-3xl font-bold text-[#434343] mb-4">
                {contactData.feedback_title}
              </h2>
              <p className="text-base text-[#434343] leading-relaxed mb-6">
                {contactData.feedback_content}
              </p>
              <button
                onClick={() => {
                  const formElement = document.querySelector('form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-md text-sm md:text-base hover:bg-orange-600 transition-colors w-full md:w-auto"
              >
                {contactData.feedback_button_text} →
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ============================
          3 CONTACT CARDS SECTION
      ============================= */}
      <div className="w-full flex justify-center items-center my-16">
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2
            md:grid-cols-1
            xl:grid-cols-3
            gap-8
            md:gap-[99px]
            place-items-center
          "
        >
          {/* CARD 1 - Address */}
          {contactData.address && (
            <Card
              icon={contactData.address_icon}
              title={contactData.address_label}
              text={addressLines.length > 0 ? addressLines : contactData.address}
            />
          )}

          {/* CARD 2 - Phone */}
          {contactData.phone && (
            <Card
              icon={contactData.phone_icon}
              title={contactData.phone_label}
              text={contactData.phone}
            />
          )}

          {/* CARD 3 - Email */}
          {contactData.email && (
            <Card
              icon={contactData.email_icon}
              title={contactData.email_label}
              text={contactData.email}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================
   REUSABLE CARD COMPONENT
============================= */

function Card({ icon, title, text }: CardProps) {
  const lines = Array.isArray(text) ? text : typeof text === 'string' ? text.split(/\r\n|\n|\r/).filter((line) => line.trim()) : [text];
  
  return (
    <div
      className="
        bg-white shadow-xl rounded-2xl
        flex flex-col items-center justify-center text-center
        w-full
        max-w-[445px]
        h-auto md:h-[376px]
        px-6 py-10
      "
    >
      <div className=" rounded-full bg-white flex items-center justify-center mb-5">
        <Image 
          src={icon} 
          alt={title} 
          width={32} 
          height={32}
          className="object-contain w-16 h-16"
          unoptimized={icon.startsWith('http')}
        />
      </div>

      <h3 className="text-[18px] md:text-[28px] font-semibold text-orange-500 mb-2">
        {title}
      </h3>

      <div className="text-sm md:text-lg text-gray-700 leading-[22px] space-y-1">
  {lines.map((line, i) => (
    <div key={i}>{line}</div>
  ))}
</div>
    </div>
  );
}
