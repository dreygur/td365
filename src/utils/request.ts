import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TradeObj } from "../types";

const BASE_URL: string = 'https://demo.tradedirect365.com'

export default async function request(path: string, cookie: string, reqBody: TradeObj) {
  try {
    const defaultBody: TradeObj = {
      userAgent: "Chrome (115.0.0.0)"
    };

    const { data } = await axios(BASE_URL + '/UTSAPI.asmx/' + path, {
      data: Object.assign(reqBody),
      method: 'POST',
      httpsAgent: new HttpsProxyAgent(process.env.PROXY || ''),
      headers: {
        cookie,
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': BASE_URL,
        'Referer': BASE_URL + '/Advanced.aspx?ots=EWTEMAJM',
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
    });

    return data;
  } catch (err) {
    throw err;
  }
}