import { Metadata } from "next";
import axios from "axios";
import BankDetailsContent from "@/components/footer/BankDetailsContent";

import EMIContent from "@/components/footer/EMIContent";
import BrandsPage from "@/components/footer/BrandsPage";

interface PageData {
  id: number;
  title: string;
  slug: string;
  type: string;
  content: string | string[];
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  keywords: string;
  created_at: string;
  updated_at: string;
  subtitle?: string;
  instruction_1?: string;
  instruction_2?: string;
  bank_accounts?: unknown[];
}

async function getPageData(slug: string): Promise<PageData | null> {
  try {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      return null;
    }

    const response = await axios.get(`${API_BASE}/pages/${slug}`, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
        Accept: "application/json",
      },
    });

    if (response.data.result && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pageData = await getPageData(params.slug);

  if (!pageData) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const title = pageData.meta_title || pageData.title;
  const description = pageData.meta_description || "";
  const keywords = pageData.keywords
    ? pageData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: pageData.meta_image ? [{ url: pageData.meta_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pageData.meta_image ? [pageData.meta_image] : [],
    },
  };
}

// Render HTML content safely
function renderContent(content: string | string[]) {
  if (!content) return null;

  // If content is a string (HTML), render it directly
  if (typeof content === "string") {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .footer-content-wrapper h6 {
              font-size: inherit !important;
              font-weight: normal !important;
              margin: 0 !important;
              line-height: 1.8 !important;
              text-align: justify !important;
            }
            .footer-content-wrapper h6 span {
              display: inline !important;
              white-space: normal !important;
              text-align: justify !important;
            }

            .footer-content-wrapper * {
              text-align: justify !important;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            .footer-content-wrapper p {
              margin-bottom: 1em;
            }
          `
        }} />
        <div
          className="footer-content-wrapper prose prose-lg max-w-none w-full"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  }

  // If content is an array, render each item
  if (Array.isArray(content)) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .footer-content-wrapper h6 {
              font-size: inherit !important;
              font-weight: normal !important;
              margin: 0 !important;
              line-height: 1.8 !important;
              text-align: justify !important;
            }
            .footer-content-wrapper h6 span {
              display: inline !important;
              white-space: normal !important;
              text-align: justify !important;
            }

            .footer-content-wrapper * {
              text-align: justify !important;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            .footer-content-wrapper p {
              margin-bottom: 1em;
            }
          `
        }} />
        <div
          className="footer-content-wrapper prose prose-lg max-w-none w-full"
        >
          {content.map((item, index) => {
            if (typeof item === "string") {
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              );
            }
            return null;
          })}
        </div>
      </>
    );
  }

  return null;
}

export default async function FooterPage({
  params,
}: {
  params: { slug: string };
}) {
  const pageData = await getPageData(params.slug);

  if (!pageData) {
    return (
      <div className="w-11/12 mx-auto my-10">
        <div className="bg-white rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a bank account details page
  const isBankDetailsPage =
    params.slug === "bank-account-details" ||
    pageData.type === "bank_account_details_page";

  // Check if this is an EMI page
  const isEMIPage =
    params.slug === "emi" ||
    pageData.type === "emi_page";

  // Check if this is a brands page
  const isBrandsPage = params.slug === "brands";

  // If it's a brands page, render the BrandsPage component
  if (isBrandsPage) {
    return <BrandsPage />;
  }

  // If it's an EMI page, render the EMI component
  if (isEMIPage) {
    // Type assertion: EMI pages have content as object structure
    // The component handles both string and object content with optional chaining
    return <EMIContent data={pageData as unknown as Parameters<typeof EMIContent>[0]['data']} />;
  }

  // If it's a bank details page, render the special component
  if (isBankDetailsPage) {
    // Only render BankDetailsContent if content is the required object
    if (
      typeof pageData.content === "object" &&
      pageData.content !== null &&
      !Array.isArray(pageData.content)
    ) {
      type BankAccount = {
        bank_name: string;
        bank_icon: string;
        account_name: string;
        account_number: string;
        branch: string;
      };
      type BankContent = {
        subtitle?: string;
        instruction_1?: string;
        instruction_2?: string;
        bank_accounts?: unknown[];
      };
      const contentObj = pageData.content as BankContent;
      const subtitle = (contentObj.subtitle ?? pageData.subtitle) ?? "";
      const instruction_1 = (contentObj.instruction_1 ?? pageData.instruction_1) ?? "";
      const instruction_2 = (contentObj.instruction_2 ?? pageData.instruction_2) ?? "";
      const bank_accounts = (contentObj.bank_accounts ?? pageData.bank_accounts ?? []) as BankAccount[];
      const content: { subtitle: string; instruction_1: string; instruction_2: string; bank_accounts: BankAccount[] } = {
        subtitle,
        instruction_1,
        instruction_2,
        bank_accounts,
      };
      const bankDetailsData: React.ComponentProps<typeof BankDetailsContent>["data"] = {
        ...pageData,
        content,
        subtitle,
        instruction_1,
        instruction_2,
        bank_accounts,
      };
      return <BankDetailsContent data={bankDetailsData} />;
    } else {
      // Fallback: content is not the required object
      return (
        <div className="w-11/12 mx-auto my-10">
          <div className="bg-white rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Bank Details Not Available
              </h1>
              <p className="text-gray-600">
                The bank details for this page are not available or are in an invalid format.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Otherwise, render the default footer page layout
  return (
    <div className="w-11/12 mx-auto my-10">
      <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10">
        {/* Page Title */}
        <h1 className="text-3xl bg-black text-white text-center md:text-3xl items-center font-semibold py-3 border-b border-gray-200">
          {pageData.title}
        </h1>

        {/* Page Content */}
        <div className="mt-6 text-gray-700 leading-relaxed w-full">
          {renderContent(pageData.content)}
        </div>

        {/* Last Updated */}
        {pageData.updated_at && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            Last updated: {new Date(pageData.updated_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

