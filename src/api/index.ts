import { AllEvents, TradeObj } from '../types';
import * as trade from './trade';
export * from './utils';

export class Trade {
  private _token: string;
  constructor(token: string) {
    this._token = token;
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
  async trade(
    tradeMode: 'buy' | 'sell' = 'buy',
    stake: string = "1",
    quoteID: number, // Item ID
    allTrades: AllEvents,
    orderObj?: TradeObj,
  ): Promise<any> {
    return trade.trade(this._token, tradeMode, stake, quoteID, allTrades, orderObj);
  }

  async tradeExtra(
    tradeMode: 'buy' | 'sell' = 'buy',
    orderType: 'stop' | 'trailing' | 'limit' | 'stopLimit' = 'stop',
    stake: string | number = 1,
    quoteID: number, // Item ID
    allTrades: AllEvents,
    orderObj?: TradeObj,
    orderStake?: string | number,
    limitStake?: string | number
  ): Promise<any> {
    return trade.tradeExtra(this._token, tradeMode, orderType, stake.toString(), quoteID, allTrades, orderObj, orderStake, limitStake)
  }

  /**
   * Exit Position
   * @param stake Amount of trade
   * @param quoteID Quote ID or Item ID
   * @param positionID Position ID of the traget order
   * @param AccountID Account ID of the trader
   * @param allTrades Websocket Event state
   * @returns
   */
  async closePosition(
    stake: string = "1",
    quoteID: number, // Item ID
    positionID: string | number,
    accountID: string | number,
    allTrades: AllEvents,
    orderObj?: TradeObj,
  ): Promise<any> {
    return trade.closePosition(this._token, stake, quoteID, positionID, accountID, allTrades, orderObj);
  }

  /**
 * Closes the Order
 * @param quoteID Quote ID or Item ID
 * @param closePositionID Position ID
 * @param orderobj Order object
 * @returns
 */
  async closeOrder(
    quoteID: string | number, // Item ID
    closePositionID: string | number,
    orderobj: TradeObj
  ): Promise<any> {
    return trade.closeOrder(this._token, quoteID, closePositionID, orderobj);
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
  async amend(
    orderType: 'stop' | 'trailing' | 'limit' | 'stopLimit' = 'stop',
    orderStake: string | number = 1,
    quoteID: number, // Item ID
    closePositionID: string | number,
    accountID: string | number,
    allTrades: AllEvents,
    limitStake?: number | string,
    orderObj?: TradeObj,
    orderID?: string | number,
  ): Promise<any> {
    return trade.amend(this._token, orderType, orderStake, quoteID, closePositionID, accountID, allTrades, limitStake, orderObj, orderID);
  }
}