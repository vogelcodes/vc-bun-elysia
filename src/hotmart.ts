export interface SalesHistoryItem {
  items: Item[];
  page_info: PageInfo;
}

export interface Item {
  product: Product;
  buyer: Buyer;
  producer: Producer;
  purchase: Purchase;
}

export interface Buyer {
  name: string;
  ucode: string;
  email: string;
}

export interface Producer {
  name: string;
  ucode: string;
}

export interface Product {
  name: string;
  id: number;
}

export interface Purchase {
  transaction: string;
  order_date: number;
  approved_date: number;
  status: string;
  recurrency_number: number;
  is_subscription: boolean;
  commission_as: string;
  price: Price;
  payment: Payment;
  tracking: Tracking;
  warranty_expire_date: number;
  offer: Offer;
  hotmart_fee: HotmartFee;
}

export interface HotmartFee {
  total: number;
  fixed: number;
  currency_code: string;
  base: number;
  percentage: number;
}

export interface Offer {
  payment_mode: string;
  code: string;
}

export interface Payment {
  method: string;
  installments_number: number;
  type: string;
}

export interface Price {
  value: number;
  currency_code: string;
}

export interface Tracking {
  source_sck: string;
  source: string;
  external_code: string;
}

export interface PageInfo {
  total_results: number;
  next_page_token: string;
  prev_page_token: string;
  results_per_page: number;
}
