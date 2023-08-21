import express from 'express';
import { handleEvent } from "./src/handlers";
import { startListening } from "./src/socket";
import { AllEvents, Auth, SubscriptionItem } from "./src/types";
import { Trade } from './src/api';

const auth: Auth = {
  "action": "authentication",
  "loginId": "TD365_TN_CUBE6044310PROD_74E_demo",
  "tradingAccountType": "SPREAD",
  "token": "cSEoK5uZdaurA4xy6bYML/IMrXmEMB2h7+x5eNifebuu8PbCJxEONKbwgbqgRnFthoSXHuXg+Akk0fX6"
};
const cookie = 'ASP.NET_SessionId=4essmxfsj4e05i4opfk2rcqf; PQMFIHXS=cSEoK5uZdaurA4xy6bYML/IMrXmEMB2h7+x5eNifebuu8PbCJxEONKbwgbqgRnFthoSXHuXg+Akk0fX6; PQMFIHXS_exp=2023-08-24T05:18:47.911Z; AWSALB=tEyYYkV7Gt5fBbugSRseRkm6I5tIO/bQ63i/LbqFUBe1UDxJW9EUxas0ODxiGXdS2SwJb0VvDJ9KqET5CJlgh+uNpDvEwrMwz+likjE7oQSlXKPUI1OC2W+rBuCs; AWSALBCORS=tEyYYkV7Gt5fBbugSRseRkm6I5tIO/bQ63i/LbqFUBe1UDxJW9EUxas0ODxiGXdS2SwJb0VvDJ9KqET5CJlgh+uNpDvEwrMwz+likjE7oQSlXKPUI1OC2W+rBuCs';

const subscriptions: SubscriptionItem[] = [];
[6374, 5945, 6647, 6647, 16917, 872703].forEach(id => subscriptions.push({ quoteId: id, priceGrouping: "Sampled", action: "subscribe" }));

const allEvents: AllEvents = {};

const api = new Trade(cookie);

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
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

app.get('/close', async (req, res) => {
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

app.post('/ammend', async (req, res) => {
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