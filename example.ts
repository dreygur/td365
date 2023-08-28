import express from 'express';
import { handleEvent } from "./src/handlers";
import { startListening } from "./src/socket";
import { AllEvents, Auth, SubscriptionItem } from "./src/types";
import { Trade } from './src/api';

const auth: Auth = {
  "action": "authentication",
  "loginId": "TD365_TN_CUBE6046527PROD_XkK_demo",
  "tradingAccountType": "SPREAD",
  "token": "v1d8mGdK7m22dp+Pdsb0C66/YjcWYQZPxDKwOob9IgVt04t+DuC5TvRhrkaU96cHlMgQNeG0XVgqgPGO"
};
const cookie = 'ASP.NET_SessionId=rjq1bwy1nauo3xzrrh05h1km; TCXMFTFC=v1d8mGdK7m22dp+Pdsb0C66/YjcWYQZPxDKwOob9IgVt04t+DuC5TvRhrkaU96cHlMgQNeG0XVgqgPGO; TCXMFTFC_exp=2023-09-04T20:21:13.333Z; AWSALB=YrpM0Q8TZAs0pksQ8L1WdpO2QMWaW0N/26z1pBca4GbhLpmrN9L9QzB/Zxxpi0EmQQoqTIKJSb8gX4NbK+ViyzbdBomVUwG5xFhV5hQv/L55uhQZ1+5FRxuavwPC; AWSALBCORS=YrpM0Q8TZAs0pksQ8L1WdpO2QMWaW0N/26z1pBca4GbhLpmrN9L9QzB/Zxxpi0EmQQoqTIKJSb8gX4NbK+ViyzbdBomVUwG5xFhV5hQv/L55uhQZ1+5FRxuavwPC';

const subscriptions: SubscriptionItem[] = [];
[6374].forEach(id => subscriptions.push({ quoteId: id, priceGrouping: "Sampled", action: "subscribe" }));

const allEvents: AllEvents = {};

const api = new Trade(cookie);

const app = express();
app.use(express.json());

function middle(req: any, res: any, next: any) {
  console.log(allEvents);
  next();
}

app.get('/', middle, async (req, res) => {
  const { side, amount } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response;
    if (side === 'buy') response = await api.trade('buy', Number(amount), 6374, allEvents);
    else response = await api.trade('sell', Number(amount), 6374, allEvents);

    console.log(response);

    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send({ message: 'Error' });
  }
});


app.get('/trade', middle, async (req, res) => {
  const { side, amount, orderType, orderStake, limitStake } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response;
    if (side === 'buy') response = await api.tradeExtra('buy', 'stop', Number(amount), 6374, allEvents, {}, Number(orderStake), Number(limitStake));
    else response = await api.tradeExtra('sell', 'stop', Number(amount), 6374, allEvents, {}, Number(orderStake), Number(limitStake));

    console.log(response);

    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send({ message: 'Error' });
  }
});

app.get('/close', middle, async (req, res) => {
  const { positionID, amount, AccountID } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response = await api.closePosition(Number(amount), 6374, Number(positionID), Number(AccountID), allEvents);

    // console.log(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error' });
  }
});

app.post('/ammend', middle, async (req, res) => {
  const { orderType, orderStake, closePositionID, accountID, limitStake, orderId } = req.body;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    console.log(limitStake);
    let response = await api.amend(orderType, orderStake, 6374, Number(closePositionID), Number(accountID), allEvents, limitStake, {}, orderId);

    // console.log(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error' });
  }
});

async function main(): Promise<void> {
  startListening(auth, subscriptions, allEvents, handleEvent);
}

// Entry point
(async () => {
  main();
  app.listen(8080, () => console.log('started'));
})();