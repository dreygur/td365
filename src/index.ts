import express from 'express';
import { closePosition, trade } from './api/trade';
import { handleEvent } from "./handlers";
import startListening from "./socket";
import { AllEvents, Auth, SubscriptionItem } from "./types";

const auth: Auth = {
  "action": "authentication",
  "loginId": "TD365_TN_CUBE6044310PROD_74E_demo",
  "tradingAccountType": "SPREAD",
  "token": "cSEoK5uZdaurA4xy6bYML/IMrXmEMB2h7+x5eNifebuu8PbCJxEONKbwgbqgRnFthoSXHuXg+Akk0fX6"
};

const subscriptions: SubscriptionItem[] = [];
[6374, 5945, 6647, 6647, 16917, 872703].forEach(id => subscriptions.push({ quoteId: id, priceGrouping: "Sampled", action: "subscribe" }));

const allEvents: AllEvents = {};

const app = express();

app.get('/', async (req, res) => {
  const { side, amount } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response;
    if (side === 'buy') response = await trade('buy', Number(amount), 6374, allEvents);
    else response = await trade('sell', Number(amount), 6374, allEvents);

    console.log(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error' });
  }
});

app.get('/close', async (req, res) => {
  const { positionID, amount, AccountID } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response = await closePosition(Number(amount), 6374, Number(positionID), Number(AccountID), allEvents);

    // console.log(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error' });
  }
})

async function main(): Promise<void> {
  startListening(auth, subscriptions, allEvents, handleEvent);
}

// Entry point
(async () => {
  main();
  app.listen(8080, () => console.log('started'));
})();