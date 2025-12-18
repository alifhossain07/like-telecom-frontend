"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const specs = [
  {
    title: "Physical Specification",
    rows: [
      { label: "Build", value: "Glass front (Corning-made glass), glass back (Corning-made glass), aluminum frame" },
      { label: "Weight", value: "174 g (6.14 oz)" },
      { label: "Dimensions", value: "146.7 x 71.5 x 7.7 mm (5.78 x 2.81 x 0.30 in)" },
    ],
  },
  {
    title: "Network",
    rows: [
      { label: "SIM", value: "Nano-SIM and eSIM or Dual SIM (Nano-SIM, dual stand-by), IP68 dust/water resistant" },
      { label: "Speed", value: "HSPA, LTE-A, 5G" },
      { label: "2G bands", value: "GSM 850 / 900 / 1800 / 1900" },
      { label: "3G bands", value: "HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100" },
      { label: "4G bands", value: "1, 3, 5, 7, 8, 20, 28" },
      { label: "5G bands", value: "1, 3, 5, 7, 8, 20, 28, 78" },
    ],
  },
  {
    title: "Display",
    rows: [
      { label: "Size", value: "6.1 inches, ~86% screen-to-body ratio" },
      { label: "Type", value: "Super Retina XDR OLED, HDR10, Dolby Vision" },
      { label: "Resolution", value: "1170 x 2532 pixels (~460 ppi density)" },
    ],
  },
  {
    title: "Processor",
    rows: [
      { label: "CPU", value: "Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)" },
      { label: "GPU", value: "Apple GPU (4-core graphics)" },
      { label: "Chipset", value: "Apple A15 Bionic (5 nm)" },
    ],
  },
  {
    title: "Memory",
    rows: [
      { label: "Internal", value: "128GB 4GB RAM, 256GB 4GB RAM, 512GB 4GB RAM NVMe" },
      { label: "Card slot", value: "No" },
    ],
  },
  {
    title: "Main Camera",
    rows: [
      { label: "Dual", value: "12 MP, f/1.6, 26mm (wide), 1.7µm, dual pixel PDAF, sensor-shift OIS; 12 MP, f/2.4, 120˚, 13mm (ultrawide)" },
      { label: "Video", value: "4K@24/30/60fps, 1080p@30/60/120/240fps, HDR, Dolby Vision HDR (up to 60fps), stereo sound rec." },
      { label: "Features", value: "Dual-LED dual-tone flash, HDR (photo/panorama)" },
    ],
  },
  {
    title: "Selfie Camera",
    rows: [
      { label: "Single", value: "12 MP, f/2.2, 23mm (wide), 1/3.6\" SL 3D, (depth/biometrics sensor)" },
      { label: "Video", value: "4K@24/25/30/60fps, 1080p@30/60/120fps, gyro-EIS" },
      { label: "Features", value: "HDR" },
    ],
  },
  {
    title: "OS",
    rows: [
      { label: "Operating System", value: "iOS 15, upgradable to iOS 17.0.3" },
    ],
  },
  {
    title: "Connectivity",
    rows: [
      { label: "NFC", value: "Yes" },
      { label: "USB", value: "Lightning, USB 2.0" },
      { label: "Radio", value: "No" },
      { label: "Wi-Fi", value: "Wi-Fi 802.11 a/b/g/n/ac/6, dual-band, hotspot" },
      { label: "Bluetooth", value: "5.0, A2DP, LE" },
      { label: "3.5mm Jack", value: "No" },
    ],
  },
  {
    title: "Features",
    rows: [
      { label: "Sensors", value: "Face ID, accelerometer, gyro, proximity, compass, barometer Ultra Wideband (UWB) support" },
    ],
  },
  {
    title: "Battery",
    rows: [
      { label: "Type", value: "Li-Ion 3240 mAh, non-removable (12.41 Wh)" },
      { label: "Charging", value: "Wired, PD2.0, 50% in 30 min (advertised) 15W wireless (MagSafe) 7.5W wireless (Qi)" },
    ],
  },
  {
    title: "Test",
    rows: [
      { label: "Performance", value: "AnTuTu: 775519 (v9) GeekBench: 4645 (v5.1) GFXBench: 59fps (ES 3.1 onscreen)" },
    ],
  }
];

export default function Specifications() {
 const [openIndexes, setOpenIndexes] = useState<number[]>(specs.map((_, index) => index));


  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto space-y-4 bg-white p-6 rounded-xl">

        <h1 className="text-2xl font-semibold">Specifications</h1>
      {specs.map((section, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
            >
              <span>{section.title}</span>
              <FaChevronDown
                className={`transition-transform duration-500 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Smooth Content */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-700 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="w-[35%] px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
