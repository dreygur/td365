import { AllEvents, TradeObj } from "../types";
import request from "../utils/request";
import { getOpenPositionDetails, getOpenPositionWithOrder } from "./utils";

/**
 * Exit Position
 * @param stake Amount of trade
 * @param quoteID Quote ID or Item ID
 * @param positionID Position ID of the traget order
 * @param AccountID Account ID of the trader
 * @param allTrades Websocket Event state
 * @returns
 */
export async function closePosition(
  cookie: string,
  stake: string | number = 1,
  quoteID: string | number, // Item ID
  positionID: string | number,
  accountID: string | number,
  allTrades: AllEvents,
  orderObj?: TradeObj,
) {
  try {
    const { tradeMode, price, key } = await getOpenPositionDetails(cookie, accountID, positionID, quoteID, allTrades);
    const defaultOrderObj: TradeObj = {
      key,
      stake,
      price,
      quoteID,
      tradeMode,
      positionID,
      marketID: 17068,
      isKaazingFeed: true,
      userAgent: "Chrome (115.0.0.0)",
    }
    return request('InsertClosePosition', cookie, Object.assign(defaultOrderObj, orderObj));
  } catch (err) { throw err; }
}

/**
 * Closes the Order
 * @param quoteID Quote ID or Item ID
 * @param closePositionID Position ID
 * @param orderobj Order object
 * @returns
 */
export async function closeOrder(
  cookie: string,
  quoteID: string | number, // Item ID
  closePositionID: string | number,
  orderobj: TradeObj
): Promise<any> {
  try {
    const defaultObj = {
      quoteID,
      closePositionID,
      marketID: 17068,
      orderTypeID: 2,
      orderPriceModeID: 2,
      userAgent: "Chrome (115.0.0.0)",
    };

    return request('InsertCloseOrder', cookie, Object.assign(orderobj, defaultObj));
  } catch (err) { throw err; }
}

/**
 * Ammend an order
 * @param orderType Type of order
 * @param orderStake Amount of stake
 * @param quoteID Quote ID or Item ID
 * @param closePositionID Postion ID to Close Order
 * @param accountID Account ID
 * @param allTrades Events state
 * @param limitStake Amount of stake for limit
 * @param orderObj Order object
 * @param orderID Order ID
 * @returns
 */
export async function amend(
  cookie: string,
  orderType: 'stop' | 'trailing' | 'limit' | 'stopLimit' = 'stop',
  orderStake: string | number = 1,
  quoteID: string | number, // Item ID
  closePositionID: string | number,
  accountID: string | number,
  allTrades: AllEvents,
  limitStake?: number | string,
  orderObj?: TradeObj,
  stopTrailingStake?: number | string,
  orderID?: string | number,
): Promise<any> {
  try {
    const orderObject = {
      orderModeID: {
        limit: 1,
        stop: 2,
        trailing: 2,
        stopLimit: 3
      },
    };

    if (!orderID) {
      const { tradeMode, price } = await getOpenPositionDetails(cookie, accountID, closePositionID, quoteID, allTrades);
      if (orderType === 'stopLimit' && !limitStake) throw new Error('limitStake is required for stopLimit');
      const defaultOrderObj: TradeObj = {
        orderStake, quoteID, tradeMode,
        isGuaranteed: false,
        orderModeID: orderObject.orderModeID[orderType],
        limitOrderPrice: ['stop', 'trailing'].includes(orderType)
          ? 0 : orderType === 'limit'
            ? Number(price) + Number(orderStake)
            : orderType === 'stopLimit'
              ? Number(price) + Number(limitStake)
              : Number(price) - Number(orderStake),
        stopOrderPrice: orderType === 'limit' ? 0 : Number(price) - Number(stopTrailingStake),
        trailingPoint: orderType == 'trailing' ? 1 : 0,
      }
      return closeOrder(cookie, quoteID, closePositionID, Object.assign(defaultOrderObj, orderObj));
    }

    const {
      marketName,
      openPrice,
      OrderID,
      LimitOrderPrice
    } = await getOpenPositionWithOrder(accountID, cookie, closePositionID, quoteID, orderID, allTrades);
    if (orderType === 'stopLimit' && !limitStake) throw new Error('limitStake is required for stopLimit');
    const defaultOrderObj: TradeObj = {
      orderStake,
      isGuaranteed: false,
      orderModeID: orderObject.orderModeID[orderType],
      limitOrderPrice: ['stop', 'trailing'].includes(orderType)
        ? 0 : orderType === 'limit'
          ? Number(openPrice) + Number(orderStake)
          : orderType === 'stopLimit'
            ? Number(openPrice) + Number(limitStake)
            : Number(openPrice) - Number(orderStake),
      stopOrderPrice: orderType === 'limit' ? 0 : Number(openPrice) - Number(orderStake),
      trailingPoint: orderType == 'trailing' ? 1 : 0,
      orderID: OrderID,
      market: marketName,
      orderTypeID: 2,
      orderPriceModeID: 2,
    };

    return request('AmendCloseOrder', cookie, Object.assign(defaultOrderObj, orderObj));
  } catch (err) { throw err; }
}

/**
 *
 * @param tradeMode Mode of trade
 * @param stake Amount of stake
 * @param quoteID Quote ID or Item ID
 * @param allTrades Trade events state
 * @param orderObj Order object
 * @returns
 */
export async function trade(
  cookie: string,
  tradeMode: 'buy' | 'sell' = 'buy',
  stake: string | number = 1,
  quoteID: string | number, // Item ID
  allTrades: AllEvents,
  orderObj?: TradeObj,
): Promise<any> {
  const price = allTrades[quoteID][`${tradeMode}Price`];
  const defaultOrderObj: TradeObj = {
    stake,
    quoteID,
    price,
    key: allTrades[quoteID].token,
    tradeMode: tradeMode.toLowerCase() === 'sell',
    marketID: 17068,
    tradeType: 1,
    hasClosingOrder: false,
    isGuaranteed: false,
    orderModeID: 0,
    orderTypeID: 2,
    orderPriceModeID: 0,
    limitOrderPrice: 0,
    stopOrderPrice: 0,
    trailingPoint: 0,
    closePositionID: 0,
    isKaazingFeed: true,
    userAgent: "Chrome (115.0.0.0)",
  };
  return request('RequestTrade', cookie, Object.assign(defaultOrderObj, orderObj));
}


/**
 * Ammend an order
 * @param orderType Type of order
 * @param orderStake Amount of stake
 * @param quoteID Quote ID or Item ID
 * @param closePositionID Postion ID to Close Order
 * @param accountID Account ID
 * @param allTrades Events state
 * @param limitStake Amount of stake for limit
 * @param orderObj Order object
 * @param orderID Order ID
 * @returns
 */
export async function tradeExtra(
  cookie: string,
  tradeMode: 'buy' | 'sell' = 'buy',
  orderType: 'stop' | 'trailing' | 'limit' | 'stopLimit' = 'stop',
  stake: string | number = 1,
  quoteID: string | number, // Item ID
  allTrades: AllEvents,
  orderObj?: TradeObj,
  orderStake?: string | number,
  limitStake?: string | number
): Promise<any> {
  try {
    const orderObject = {
      orderModeID: {
        limit: 1,
        stop: 2,
        trailing: 2,
        stopLimit: 3
      },
    };

    const [price, key] = [allTrades[quoteID][`${tradeMode}Price`], allTrades[quoteID].token];

    if (orderType === 'stopLimit' && !limitStake) throw new Error('limitStake is required for stopLimit');
    const defaultOrderObj: TradeObj = {
      key,
      price,
      stake,
      quoteID,
      closePositionID: 0,
      hasClosingOrder: true,
      isGuaranteed: false,
      isKaazingFeed: true,
      limitOrderPrice: ['stop', 'trailing'].includes(orderType)
        ? 0 : orderType === 'limit'
          ? Number(price) + Number(orderStake)
          : orderType === 'stopLimit'
            ? Number(price) + Number(limitStake)
            : Number(price) - Number(orderStake),
      stopOrderPrice: orderType === 'limit' ? 0 : Number(price) - Number(orderStake),
      marketID: 17068,
      orderModeID: orderObject.orderModeID[orderType],
      orderPriceModeID: 2,
      orderTypeID: 2,
      tradeMode: tradeMode.toLowerCase() === 'sell',
      tradeType: 1,
      trailingPoint: orderType == 'trailing' ? 1 : 0,
      userAgent: "Chrome (115.0.0.0)"
    };

    return request('RequestTrade', cookie, Object.assign(defaultOrderObj, orderObj));
  } catch (err) { throw err; }
}