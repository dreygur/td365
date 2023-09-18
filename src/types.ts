
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

export type TradeObj = {
  market?: string;
  marketID?: number;
  orderModeID?: number;
  orderTypeID?: number;
  orderID?: number | string;
  orderPriceModeID?: number;
  limitOrderPrice?: number;
  stopOrderPrice?: number | string;
  trailingPoint?: number;
  orderStake?: number | string;
  positionID?: string | number;
  closePositionID?: number;
  stake?: string;
  tradeType?: string | number;
  tradeMode?: boolean;
  hasClosingOrder?: boolean;
  isGuaranteed?: boolean;
  isKaazingFeed?: boolean;

  // To be Added Later in api logic
  quoteID?: number;
  userAgent?: string;
  price?: number;
  key?: string;
};