import { AllEvents } from "../types";
import request from "../utils/request";

/**
 * Get Open Postion Details
 * @param AccountID Account ID of the trader
 * @param cookie Account Cookie
 * @param positionID Position ID of the traget order
 * @param quoteID Quote ID or Item ID
 * @param allTrades Websocket Event state
 * @returns
 */
export async function getOpenPositionDetails(
  cookie: string,
  AccountID: string | number,
  positionID: string | number,
  quoteID: number,
  allTrades: AllEvents
) {
  try {
    const { d: { Direction, MarketName, OpenPrice } } = await request(`/GetOpenPosition?AccountID=${AccountID}`, cookie, { positionID });
    const tradeMode = Direction.toLowerCase() === 'buy';
    const [price, key] = tradeMode
      ? [Number(allTrades[quoteID].sellPrice), allTrades[quoteID].token]
      : [Number(allTrades[quoteID].buyPrice), allTrades[quoteID].token];

    let response = {
      tradeMode, price, key,
      marketName: MarketName,
      openPrice: OpenPrice
    };
    return response;
  } catch (error) { throw error; }
}

/**
 * Get Postion Details with Order Details
 * @param AccountID Account ID of the trader
 * @param cookie Account Cookie
 * @param positionID Position ID of the traget order
 * @param quoteID Quote ID or Item ID
 * @param orderID Order ID of previous ammend
 * @param allTrades Websocket Event state
 * @returns
 */
export async function getOpenPositionWithOrder(
  accountID: string | number,
  cookie: string,
  positionID: string | number,
  quoteID: string | number,
  orderID: string | number,
  allTrades: AllEvents
) {
  try {
    let {
      d: {
        openPosition: { Direction, MarketName, OpenPrice },
        closeOrder: { LimitOrderPrice, OrderID }
      }
    } = await request(`/GetOpenPositionWithOrder?AccountID=${accountID}`, cookie, { positionID, orderID });
    const tradeMode = Direction.toLowerCase() === 'buy';
    const [price, key] = tradeMode
      ? [allTrades[quoteID].sellPrice, allTrades[quoteID].token]
      : [allTrades[quoteID].buyPrice, allTrades[quoteID].token];

    return {
      tradeMode, price, key,
      marketName: MarketName,
      openPrice: OpenPrice,
      OrderID,
      LimitOrderPrice
    };
  } catch (error) { throw error; }
}
