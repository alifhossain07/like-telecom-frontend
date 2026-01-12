import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Simple CSV Parser
function parseCSV(csvText: string) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escape quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.length > 0 && (currentRow.length > 1 || currentRow[0] !== "")) {
         rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  // Add last row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  return rows;
}

export async function GET() {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  try {
    // 1. Fetch metadata from Backend
    const res = await fetch(`${API_BASE}/pages/used-device-page`, {
      headers: {
        "Content-Type": "application/json",
        "System-Key": SYSTEM_KEY!,
      },
      cache: "no-store",
    });

    const json = await res.json();
    
    // 2. Try to fetch CSV content if iframe link exists
    let csvData = null;
    let tableHeaders = null;
    let tableRows = null;

    if (json.data && json.data.content && json.data.content.iframe_link) {
        const iframeString = json.data.content.iframe_link;
        const match = iframeString.match(/src="([^"]+)"/);
        if (match && match[1]) {
            const src = match[1];
            // Convert to CSV URL: define specific patterns if needed, but for /pubhtml:
            // https://docs.google.com/spreadsheets/d/e/.../pubhtml -> .../pub?output=csv
            if (src.includes("/pubhtml")) {
                const csvUrl = src.replace("/pubhtml", "/pub?output=csv").split('?')[0] + "?output=csv";
                 
                 try {
                     const csvRes = await fetch(csvUrl, { cache: 'no-store' });
                     if (csvRes.ok) {
                         const text = await csvRes.text();
                         const parsed = parseCSV(text);
                         if (parsed.length > 0) {
                             tableHeaders = parsed[0];
                             tableRows = parsed.slice(1);
                             csvData = true;
                         }
                     }
                 } catch (e) {
                     console.error("CSV Fetch Error:", e);
                 }
            }
        }
    }

    // Return combined data
    return NextResponse.json({
        ...json,
        csvData: {
            success: !!csvData,
            headers: tableHeaders,
            rows: tableRows
        }
    });

  } catch (error) {
    console.error("Error fetching used device page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch page data" },
      { status: 500 }
    );
  }
}

