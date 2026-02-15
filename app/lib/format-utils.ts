/**
 * Formats a number as a price string with commas according to the South Asian numbering system (Lakh/Crore).
 * Example: 201512 -> "2,01,512"
 * 
 * @param price - The numeric price to format
 * @returns A string representing the formatted price
 */
export const formatPrice = (price: number | string): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(num)) return price.toString();

  // Use 'en-IN' for South Asian numbering format (Lakh, Crore)
  return new Intl.NumberFormat('en-IN').format(num);
};
