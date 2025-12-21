import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

type BrandItem = {
  name: string;
  icon: string;
};

// Define the structure of the API response
type BrandCategoriesResponse = {
  title?: string;
  subtitle?: string;
  data?: {
    data?: {
      name: string;
      icon: string;
    }[];
  };
};

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/brand-categories`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const json: BrandCategoriesResponse = await res.json();

    // Map only required fields
    const simplifiedData: BrandItem[] = json.data?.data?.map((item) => ({
      name: item.name,
      icon: item.icon,
    })) ?? [];

    return NextResponse.json({
      success: true,
      title: json.title ?? "",
      subtitle: json.subtitle ?? "",
      brands: simplifiedData,
    });

  } catch (error) {
    console.error("Brand Categories API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load brand categories" },
      { status: 500 }
    );
  }
}
