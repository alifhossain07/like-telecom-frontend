// Review-related TypeScript interfaces

export interface ReviewImage {
  image: string; // base64 encoded image
  filename: string;
}

export interface ReviewSubmission {
  product_id: number;
  rating: number;
  comment: string;
  images?: ReviewImage[];
}

export interface PendingReviewProduct {
  id: number;
  product_id?: number;
  name?: string;
  product_name?: string;
  thumbnail_image?: string;
  thumbnail?: string;
  product_thumbnail?: string;
  image?: string;
  // Add other product fields as needed
}

export interface ReviewHistoryItem {
  id: number;
  product_id: number;
  product_name: string;
  product_thumbnail: string;
  rating: number;
  comment: string;
  photos: string[];
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewHistoryResponse {
  result: boolean;
  data: ReviewHistoryItem[];
}

export interface ProductReviewItem {
  user_id: number;
  user_name: string;
  avatar: string;
  images: Array<{ path: string }>;
  rating: number;
  comment: string;
  time: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ProductReviewsResponse {
  data: ProductReviewItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
  success: boolean;
  status: number;
}
