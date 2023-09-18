import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TradeObj } from "../types";

const BASE_URL: string = 'https://demo.tradedirect365.com'

export default async function request(path: string, cookie: string, reqBody: TradeObj): Promise<any> {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'post',
      url: BASE_URL + '/UTSAPI.asmx/' + path,
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': '_ga=GA1.1.1387548407.1692031234; ASP.NET_SessionId=xlrc4xivgk3q4qev2hlkckaz; RSAYBVQK=eWdng937cySd6H5YTV6HLwa9+SpJr4yNFk67OccbG+pcGr6GxMKQA0L6uDVPuFnh70JT3lHmRTtb+jSz; RSAYBVQK_exp=2023-09-25T15:11:55.195Z; _ga_L14D3Z3R57=GS1.1.1695049916.8.0.1695049916.60.0.0; SL_C_23361dd035530_SID={"5ee9ad8176f9dc32888f51354fe66a134c7ebe56":{"sessionId":"UAwCSjq-4N6V4Lpkklflb","visitorId":"AkXVxEah3KeUNOW-iBkGf"}}; AWSALB=Yic0F4jwY7/MjSAhHBVd4hk7Ui5kHzhpVLeDY2kke0t4jZubFEyJUxpbOJeBnMdayFGCsZh38UA1GTaMPifbBg2b3AkilhE9bnWLog4b3Zts663ooSbGpdPKflef; AWSALBCORS=Yic0F4jwY7/MjSAhHBVd4hk7Ui5kHzhpVLeDY2kke0t4jZubFEyJUxpbOJeBnMdayFGCsZh38UA1GTaMPifbBg2b3AkilhE9bnWLog4b3Zts663ooSbGpdPKflef; AWSALB=+nlpbF1z+F7qfhzyVR+nSxE6vbnNFyD69s1pcNvZgTRqdyvLDTc6DYWwqS5s3EO7NomCmXEx61cZ6dU93wB8ryl2z02sL2SMEmwfjARl0Pf2/iZOklRMtIevuO0K; AWSALBCORS=+nlpbF1z+F7qfhzyVR+nSxE6vbnNFyD69s1pcNvZgTRqdyvLDTc6DYWwqS5s3EO7NomCmXEx61cZ6dU93wB8ryl2z02sL2SMEmwfjARl0Pf2/iZOklRMtIevuO0K',
        'DNT': '1',
        'Origin': BASE_URL,
        'Referer': BASE_URL + '/Advanced.aspx?ots=RSAYBVQK',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"'
      },
      data: reqBody
    };

    axios(config)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
  });
}