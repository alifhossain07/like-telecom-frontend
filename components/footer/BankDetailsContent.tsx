"use client";

import Image from "next/image";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

interface BankAccount {
  bank_name: string;
  bank_icon: string;
  account_name: string;
  account_number: string;
  branch: string;
}

interface BankDetailsContentProps {
  data: {
    id: number;
    title: string;
    slug: string;
    type: string;
    content: {
      subtitle: string;
      instruction_1: string;
      instruction_2: string;
      bank_accounts: BankAccount[];
    };
    subtitle?: string;
    instruction_1?: string;
    instruction_2?: string;
    bank_accounts?: BankAccount[];
  };
}

export default function BankDetailsContent({ data }: BankDetailsContentProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Account number copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy account number");
    }
  };

  // Use data from content object or from root level (API returns both)
  const subtitle = data.content?.subtitle || data.subtitle || "";
  const instruction1 = data.content?.instruction_1 || data.instruction_1 || "";
  const instruction2 = data.content?.instruction_2 || data.instruction_2 || "";
  const bankAccounts = data.content?.bank_accounts || data.bank_accounts || [];

  return (
    <div className="w-11/12 mx-auto my-10">
      <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10">
        {/* Page Title */}

        <div className="flex flex-col justify-center items-center">
          
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base md:text-lg text-gray-600 mb-6">{subtitle}</p>
        )}

        {/* Instructions */}
        {instruction1 && (
          <p className="text-gray-700 mb-4 text-base">{instruction1}</p>
        )}

        {/* Important Warning */}
        {instruction2 && (
          <p className="text-red-600 font-medium mb-8 text-base">
            {instruction2}
          </p>
        )}
</div>
        {/* Bank Account Cards */}
        {bankAccounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {bankAccounts.map((account, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Bank Logo and Name */}
                <div className="flex items-center gap-3 mb-5">
                  {account.bank_icon && account.bank_icon.startsWith('http') && (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={account.bank_icon}
                        alt={account.bank_name}
                        fill
                        className="object-contain"
                        sizes="40px"
                        unoptimized
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {account.bank_name}
                  </h3>
                </div>

                {/* Account Name */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1.5 font-medium">
                    Account Name
                  </p>
                  <p className="text-base text-gray-900">
                    {account.account_name}
                  </p>
                </div>

                {/* Account Number with Copy Button */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1.5 font-medium">
                    Account Number
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base text-gray-900 flex-1 break-all">
                      {account.account_number}
                    </p>
                    <button
                      onClick={() => copyToClipboard(account.account_number)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      aria-label="Copy account number"
                      title="Copy account number"
                    >
                      <FiCopy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <p className="text-sm text-gray-500 mb-1.5 font-medium">
                    Branch
                  </p>
                  <p className="text-base text-gray-900">
                    {account.branch}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

