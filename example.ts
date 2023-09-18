import express from 'express';
import { handleEvent } from "./src/handlers";
import { startListening } from "./src/socket";
import { AllEvents, Auth, SubscriptionItem } from "./src/types";
import { Trade } from './src/api';

// process.env.PROXY

const auth: Auth = {
  "action": "authentication",
  "loginId": "TD365_TN_CUBE6050010PROD_v5Y_demo",
  "tradingAccountType": "SPREAD",
  "token": "eWdng937cySd6H5YTV6HLwa9+SpJr4yNFk67OccbG+pcGr6GxMKQA0L6uDVPuFnh70JT3lHmRTtb+jSz"
};
const cookie = 'ASP.NET_SessionId=ttfjiiyitgf5tcraropf2f52; SLKVQJHP=eWdng937cySd6H5YTV6HLwa9+SpJr4yNFk67OccbG+pcGr6GxMKQA0L6uDVPuFnh70JT3lHmRTtb+jSz; AWSALBCORS=OtRExY3EIcaZ1HJk2+cBsN2wUkAvQFBzxftpwzq4kNCSqBbNJC2jUBuBDVwprD3pspSaZRRsdtPul7oRTBUmUxsPnUbm2t8wOj/HfxJimwCMkpNh76NfOa2mw0G8; AWSALB=OtRExY3EIcaZ1HJk2+cBsN2wUkAvQFBzxftpwzq4kNCSqBbNJC2jUBuBDVwprD3pspSaZRRsdtPul7oRTBUmUxsPnUbm2t8wOj/HfxJimwCMkpNh76NfOa2mw0G8';

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
    if (side === 'buy') response = await api.trade('buy', amount?.toString(), 6374, allEvents);
    else response = await api.trade('sell', amount?.toString(), 6374, allEvents);

    console.log(response);

    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ message: 'Error' });
  }
});


app.get('/trade', async (req, res) => {
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

app.get('/close', async (req, res) => {
  const { positionID, amount, AccountID } = req.query;

  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    let response = await api.closePosition(amount?.toString(), 6374, Number(positionID), Number(AccountID), allEvents);

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
  startListening(auth, subscriptions, allEvents, handleEvent, () => { console.log('[+] Authenticated!') });
}

// Entry point
(async () => {
  main();
  app.listen(8080, () => console.log('started'));
})();