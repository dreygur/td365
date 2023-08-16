import { AllEvents } from "../types";
import request from "../utils/request";

const cookie = 'UDPHHMSF=yqKJzyDBNxmEonrLlwCv1Ccz9xRymwUeFTmeUxXqtdeKLvwZDB9e4lW6w2P9JzvgSwBqV0yjZsEeeFxu; UDPHHMSF_exp=2023-08-21T16:40:32.849Z; _ga=GA1.1.1387548407.1692031234; ASP.NET_SessionId=ctrp0g1wnpd5do5sfkbdig3r; NYONGGFW=cSEoK5uZdaurA4xy6bYML/IMrXmEMB2h7+x5eNifebuu8PbCJxEONKbwgbqgRnFthoSXHuXg+Akk0fX6; NYONGGFW_exp=2023-08-23T14:51:16.946Z; _ga_L14D3Z3R57=GS1.1.1692197480.2.1.1692197483.57.0.0; SL_C_23361dd035530_SID={"5ee9ad8176f9dc32888f51354fe66a134c7ebe56":{"sessionId":"UDkR1tz5KsZSIzvPywsmO","visitorId":"AkXVxEah3KeUNOW-iBkGf"}}; AWSALB=bXSvCrJenmAPVSzt4t6OyWdaWsQaLEL4nCNc6Kbro6XeOr5XWQr6cNNOl/gxkBT9a1qvtDUiuFlaSlj0l12LPsPI8wytmmjguwMkqBmM4BL2QHK++sP1gGBnoaRV; AWSALBCORS=bXSvCrJenmAPVSzt4t6OyWdaWsQaLEL4nCNc6Kbro6XeOr5XWQr6cNNOl/gxkBT9a1qvtDUiuFlaSlj0l12LPsPI8wytmmjguwMkqBmM4BL2QHK++sP1gGBnoaRV';

export async function getOpenPositionDetails(
  AccountID: string | number,
  cookie: string,
  positionID: string | number,
  quoteID: string | number,
  allTrades: AllEvents
) {
  try {
    let { d: {
      openPosition: { Direction, MarketName, OpenPrice }
    }
    } = await request(`/GetOpenPosition?AccountID=${AccountID}`, cookie, { positionID });
    const tradeMode = Direction.toLowerCase() === 'buy';
    const [price, key] = tradeMode
      ? [allTrades[quoteID].sellPrice, allTrades[quoteID].token]
      : [allTrades[quoteID].buyPrice, allTrades[quoteID].token];

    let response = {
      tradeMode, price, key,
      marketName: MarketName,
      openPrice: OpenPrice
    };
    return response;
  } catch (error) { throw error; }
}

export async function getOpenPositionWithOrder(
  AccountID: string | number,
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
    } = await request(`/GetOpenPositionWithOrder?AccountID=${AccountID}`, cookie, { positionID, orderID });
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

export async function closePosition(
  stake: string | number = 1,
  quoteID: string | number, // Item ID
  positionID: string | number,
  AccountID: string | number,
  allTrades: AllEvents,
) {
  try {
    const { tradeMode, price, key } = await getOpenPositionDetails(AccountID, cookie, positionID, quoteID, allTrades);
    return request('InsertClosePosition', cookie, {
      key,
      stake,
      price,
      quoteID,
      tradeMode,
      positionID,
      marketID: 17068,
      isKaazingFeed: true,
      userAgent: "Chrome (115.0.0.0)",
    });
  } catch (err) { throw err; }
}

export async function amend(
  orderType: 'stop' | 'trailing' | 'limit' | 'stopLimit' = 'stop',
  orderStake: string | number = 1,
  quoteID: string | number, // Item ID
  positionID: string | number,
  accountID: string | number,
  allTrades: AllEvents,
  isGuaranteed: boolean = false,
  orderID: string | number
) {
  try {
    const { tradeMode, price, key } = await getOpenPositionWithOrder(accountID, cookie, positionID, quoteID, orderID, allTrades);

    const orderObject = {
      orderModeID: {
        limit: 1,
        stop: 2,
        trailing: 2,
        stopLimit: 3
      },

    };


    return request('AmendCloseOrder', cookie, {
      key,
      price,
      quoteID,
      tradeMode,
      positionID,
      orderStake,
      isGuaranteed,
      orderModeID: orderObject.orderModeID[orderType],
      marketID: 17068,
      orderTypeID: 2,
      userAgent: "Chrome (115.0.0.0)",
      stopOrderPrice: "15759.9",
    });

    /* Stop
    {
        "marketID": 17068,
        "quoteID": 6374,
        "tradeMode": true,
        "orderStake": "5",
        "isGuaranteed": false,
        "orderModeID": 2,
        "orderTypeID": 2,
        "orderPriceModeID": 2,
        "limitOrderPrice": 0,
        "stopOrderPrice": "15720.4",
        "trailingPoint": 0,
        "closePositionID": 23150238
    }
    */

    /* Trailing
    {
        "marketID": 17068,
        "quoteID": 6374,
        "tradeMode": true,
        "orderStake": "5",
        "isGuaranteed": false,
        "orderModeID": 2,
        "orderTypeID": 2,
        "orderPriceModeID": 2,
        "limitOrderPrice": 0,
        "stopOrderPrice": "15719.9",
        "trailingPoint": 1,
        "closePositionID": 23150220
    }
    */

    /* Limit
    {
      "market": "Germany 40 - Rolling Cash",
      "orderID": 22835524,
      "limitOrderPrice": "15779.9",
      "stopOrderPrice": 0,
      "trailingPoint": 0,
      "isGuaranteed": false
    }
    */

    /* Stop-Limit
    {
      "market": "Germany 40 - Rolling Cash",
      "orderID": 22835524,
      "limitOrderPrice": "15779.9",
      "stopOrderPrice": "14782.9",
      "trailingPoint": 0,
      "isGuaranteed": false
  }
    */


  } catch (err) { throw err; }
}

export async function trade(
  tradeMode: 'buy' | 'sell' = 'buy',
  stake: string | number = 1,
  quoteID: string | number, // Item ID
  allTrades: AllEvents,
) {
  const price = allTrades[quoteID][`${tradeMode}Price`];
  return request('RequestTrade', cookie, {
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
  });
}