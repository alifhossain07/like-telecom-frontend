"use client";

import { useState } from "react";

interface EMIBank {
  id: number;
  sl: number;
  name: string;
  minimum_amount: string;
  rate_3_months: string | null;
  rate_6_months: string | null;
  rate_9_months: string | null;
  rate_12_months: string | null;
  rate_18_months: string | null;
  rate_24_months: string | null;
  rate_30_months: string | null;
  rate_36_months: string | null;
}

interface FAQ {
  question: string;
  answer: string;
}

interface EMIContentProps {
  data: {
    id: number;
    title: string;
    slug: string;
    type: string;
    content: {
      header_title: string;
      intro_text: string;
      policy_points: string[];
      contact_label: string;
      contact_number: string;
      phones_laptops_title: string;
      phones_laptops_content: string;
      iphone_title: string;
      iphone_content: string;
      samsung_title: string;
      samsung_content: string;
      faq_title: string;
      faq_tagline: string;
      faqs: FAQ[];
    };
    header_title?: string;
    intro_text?: string;
    policy_points?: string[];
    contact_label?: string;
    contact_number?: string;
    phones_laptops_title?: string;
    phones_laptops_content?: string;
    iphone_title?: string;
    iphone_content?: string;
    samsung_title?: string;
    samsung_content?: string;
    faq_title?: string;
    faq_tagline?: string;
    faqs?: FAQ[];
    emi_banks?: EMIBank[];
  };
}

export default function EMIContent({ data }: EMIContentProps) {
  // Use data from content object or from root level (API returns both)
  const headerTitle = data.content?.header_title || data.header_title || data.title || "";
  const introText = data.content?.intro_text || data.intro_text || "";
  const policyPoints = data.content?.policy_points || data.policy_points || [];
  const contactLabel = data.content?.contact_label || data.contact_label || "";
  const contactNumber = data.content?.contact_number || data.contact_number || "";
  const phonesLaptopsTitle = data.content?.phones_laptops_title || data.phones_laptops_title || "";
  const phonesLaptopsContent = data.content?.phones_laptops_content || data.phones_laptops_content || "";
  const iphoneTitle = data.content?.iphone_title || data.iphone_title || "";
  const iphoneContent = data.content?.iphone_content || data.iphone_content || "";
  const samsungTitle = data.content?.samsung_title || data.samsung_title || "";
  const samsungContent = data.content?.samsung_content || data.samsung_content || "";
  const faqTitle = data.content?.faq_title || data.faq_title || "";
  const faqTagline = data.content?.faq_tagline || data.faq_tagline || "";
  const faqs = data.content?.faqs || data.faqs || [];
  const emiBanks = data.emi_banks || [];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const formatRate = (rate: string | null) => {
    if (!rate || rate === "null") return "-";
    const numRate = parseFloat(rate);
    if (isNaN(numRate)) return "-";
    return numRate === 0 ? "0%" : `${numRate}%`;
  };

  return (
    <div className="w-11/12 mx-auto my-10">
      <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10">
        {/* Header Title */}
        <h1 className="text-2xl md:text-3xl font-bold bg-gray-200 py-3 text-black mb-6 text-center">
          {headerTitle}
        </h1>

        {/* Intro Text */}
        {introText && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
              {introText}
            </p>
          </div>
        )}

        {/* Policy Points */}
        {policyPoints.length > 0 && (
          <div className="mb-8  rounded-lg ">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">EMI Policy Points</h2>
            <ul className="space-y-3">
              {policyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="text-gray-700 text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Section */}
        {(contactLabel || contactNumber) && (
          <div className="mb-8  rounded-lg  ">
            {contactLabel && (
              <p className="text-gray-700 mb-2 text-base">{contactLabel}</p>
            )}
            {contactNumber && (
              <a
                href={`tel:${contactNumber.replace(/\s/g, "")}`}
                className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors"
              >
                {contactNumber}
              </a>
            )}
          </div>
        )}

        {/* Bank EMI Rates Table */}
        {emiBanks.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <h2 className="text-sm md:text-xl text-center font-bold bg-gray-200 py-3 text-gray-900 mb-6">
            আমাদের অফলাইন শপে ক্রেডিট কার্ড ব্যবহারের ক্ষেত্রে কত মাসের জন্য কত শতাংশ (%) প্রযোজ্য হবে নিম্নে উল্লেখ করা হল
            </h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <div className="max-h-[320px] md:max-h-[440px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800 text-white sticky top-0 z-20">
                      <tr>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold uppercase tracking-wider sticky left-0 bg-gray-800 z-30 max-w-[100px] md:max-w-[150px]">
                          Bank Name
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          3 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          6 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          9 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          12 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          18 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          24 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          30 Months
                        </th>
                        <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                          36 Months
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emiBanks.map((bank) => (
                        <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-2 md:px-4 py-2 md:py-3 text-[11px] md:text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 max-w-[100px] md:max-w-[150px]">
                            <div className="truncate" title={bank.name}>
                              {bank.name}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_3_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_6_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_9_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_12_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_18_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_24_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_30_months)}
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[11px] md:text-sm text-center text-gray-700">
                            {formatRate(bank.rate_36_months)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
           
          </div>
        )}

        {/* Phones & Laptops Section */}
        {(phonesLaptopsTitle || phonesLaptopsContent) && (
          <div className="mb-8">
            {phonesLaptopsTitle && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {phonesLaptopsTitle}
              </h2>
            )}
            {phonesLaptopsContent && (
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {phonesLaptopsContent}
              </p>
            )}
          </div>
        )}

        {/* iPhone Section */}
        {(iphoneTitle || iphoneContent) && (
          <div className="mb-8">
            {iphoneTitle && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {iphoneTitle}
              </h2>
            )}
            {iphoneContent && (
              <p className="text-gray-700 leading-relaxed text-base">
                {iphoneContent}
              </p>
            )}
          </div>
        )}

        {/* Samsung Section */}
        {(samsungTitle || samsungContent) && (
          <div className="mb-8">
            {samsungTitle && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {samsungTitle}
              </h2>
            )}
            {samsungContent && (
              <p className="text-gray-700 leading-relaxed text-base">
                {samsungContent}
              </p>
            )}
          </div>
        )}

        

        {/* FAQ Section */}
        <div className="flex flex-col justify-center items-center bg-gray-200 py-6 px-4 text-gray-900 mb-6">
        {(faqTitle || faqs.length > 0) && (
          <div className="mb-8">
            {faqTitle && (
              <h2 className="text-lg md:text-2xl text-center font-bold text-gray-900 mb-2">
                {faqTitle}
              </h2>
            )}
            {faqTagline && (
              <p className="text-gray-600 mb-6 text-center text-sm md:text-base">{faqTagline}</p>
            )}
            {faqs.length > 0 && (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <span className="text-gray-600 flex-shrink-0">
                        {expandedFaq === index ? "−" : "+"}
                      </span>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

