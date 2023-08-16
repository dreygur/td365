
export type AllEvents = {
  [key: string]: {
    sellPrice: number | string;
    buyPrice: number | string;
    token: string;
    low: number | string;
    high: number | string;
  }
};

export type Auth = {
  action: string;
  loginId: string;
  tradingAccountType: string;
  token: string;
};

export type SubscriptionItem = {
  quoteId: number | string;
  priceGrouping: string;
  action: string;
}

export type ResponseEvent = {
  t: string;
  d: PriceData;
  cid: string;
};

export type PriceData = {
  QuoteId?: number;
  Current?: string[];
  Action?: string;
  HasError?: boolean;
  Result?: boolean;
  sp?: string[];
};