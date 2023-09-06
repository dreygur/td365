import express from 'express';
import { handleEvent } from "./src/handlers";
import { startListening } from "./src/socket";
import { AllEvents, Auth, SubscriptionItem } from "./src/types";
import { Trade } from './src/api';

// process.env.PROXY

const auth: Auth = {
  "action": "authentication",
  "loginId": "TD365_TN_CUBE6047926PROD_BBE_demo",
  "tradingAccountType": "SPREAD",
  "token": "np9nt2i9DQNkF5DfaJcX1q2cetXIDv1h91tGoIpT9jk3+f9sEDjMBXpL1XL6MAKNWhfEe3G9vuQHmer+"
};
const cookie = 'ASP.NET_SessionId=msknxk0dhin4faf0i3dr3qcd; SGITAOKL=np9nt2i9DQNkF5DfaJcX1q2cetXIDv1h91tGoIpT9jk3+f9sEDjMBXpL1XL6MAKNWhfEe3G9vuQHmer+; SGITAOKL_exp=2023-09-13T09:55:14.064Z; AWSALB=isTGFgeUwi2kxybWoZzCI+shXBd1UfDxpBZR4lQgJsdJUPuLua1gyhS6/OuFXZ6Y9xQ46TfukR8TOSrL2OpocT4KOx0eKhtrfT+K4P2zFXnJMLuxryapsmADsgf1; AWSALBCORS=isTGFgeUwi2kxybWoZzCI+shXBd1UfDxpBZR4lQgJsdJUPuLua1gyhS6/OuFXZ6Y9xQ46TfukR8TOSrL2OpocT4KOx0eKhtrfT+K4P2zFXnJMLuxryapsmADsgf1';

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
  startListening(auth, subscriptions, allEvents, handleEvent, () => { console.log('[+] Authenticated!') });
}

// Entry point
(async () => {
  main();
  app.listen(8080, () => console.log('started'));
})();