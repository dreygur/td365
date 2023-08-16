import express from 'express';
import axios from 'axios';
import { handleEvent } from "./handlers";
import startListening from "./socket";
import { AllEvents, Auth, ResponseEvent, SubscriptionItem } from "./types";

const auth: Auth = { "action": "authentication", "loginId": "TD365_TN_CUBE6044259PROD_SeT_demo", "tradingAccountType": "SPREAD", "token": "ecIEQ/Ow07aAundsJ762KRkNrMoc+MC/rRne6zTw06xQ/GN+WumhGVSJBfzExv9WVlZSm7PfO75EJskn" };

const subscriptions: SubscriptionItem[] = [
  { quoteId: 6374, priceGrouping: "Sampled", action: "subscribe" },
  { "quoteId": 5945, "priceGrouping": "Sampled", "action": "subscribe" },
  { "quoteId": 6647, "priceGrouping": "Sampled", "action": "subscribe" },
  { "quoteId": 16917, "priceGrouping": "Sampled", "action": "subscribe" },
  { "quoteId": 872703, "priceGrouping": "Sampled", "action": "subscribe" }
];

const allEvents: AllEvents = {};

const app = express();
app.get('/', async (req, res) => {
  if (!allEvents[6374]) return res.status(200).send({ message: 'No events' });
  try {
    const response = await axios("https://demo.tradedirect365.com/UTSAPI.asmx/RequestTrade", {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': 'TKFSTPBC=J8lymtwQut951ty8k+BOKxs0lGvNEc0Wgp1ghk244DmgqwJo8smq50S505dNFXtZnRelCBSSqjtoD1VZ; TKFSTPBC_exp=2023-08-21T05:44:24.414Z; ASP.NET_SessionId=o4qa2nq2gan4j31r0xaprrid; EWTEMAJM=ecIEQ/Ow07aAundsJ762KRkNrMoc+MC/rRne6zTw06xQ/GN+WumhGVSJBfzExv9WVlZSm7PfO75EJskn; EWTEMAJM_exp=2023-08-23T10:32:19.542Z; AWSALB=jHeMjTPssTqYYhjhGMX6b0t99TVgf+X5ycRrz2iaeKkWpsfoW5IIweOHgftXbI5vbMSw1x52YLrUs0EO8XY6CQTqr680jiqjhCeCDpWubWBTuR4kie2PwvVnXCNe; AWSALBCORS=jHeMjTPssTqYYhjhGMX6b0t99TVgf+X5ycRrz2iaeKkWpsfoW5IIweOHgftXbI5vbMSw1x52YLrUs0EO8XY6CQTqr680jiqjhCeCDpWubWBTuR4kie2PwvVnXCNe',
        'Origin': 'https://demo.tradedirect365.com',
        'Referer': 'https://demo.tradedirect365.com/Advanced.aspx?ots=EWTEMAJM',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'dnt': '1',
        'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-gpc': '1'
      },
      data: {
        "marketID": 17068,
        "quoteID": 6374,
        "price": allEvents[6374].buyPrice,
        "stake": "1",
        "tradeType": 1,
        "tradeMode": false,
        "hasClosingOrder": false,
        "isGuaranteed": false,
        "orderModeID": 0,
        "orderTypeID": 2,
        "orderPriceModeID": 0,
        "limitOrderPrice": 0,
        "stopOrderPrice": 0,
        "trailingPoint": 0,
        "closePositionID": 0,
        "isKaazingFeed": true,
        "userAgent": "Chrome (115.0.0.0)",
        "key": allEvents[6374].token
      },
    });

    console.log(response.data);

    return res.status(200).json({ status: 'Submitted' });
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