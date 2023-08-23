import axios from 'axios';

async function main() {

  var { data } = await axios.post(
    'https://td365.eu.auth0.com/oauth/token',
    {
      'realm': 'Username-Password-Authentication',
      'client_id': 'eeXrVwSMXPZ4pJpwStuNyiUa7XxGZRX9',
      'scope': 'openid',
      'grant_type': 'http://auth0.com/oauth/grant-type/password-realm',
      'username': 'dsfdsafdsfs@afdadsf.com',
      'password': 'nWG63zt2MG$#cVN'
    },
    {
      headers: {
        'authority': 'td365.eu.auth0.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7',
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://traders.td365.com',
        'referer': 'https://traders.td365.com/',
        'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }
  );

  console.log(data);

  var { data: { url } } = await axios.post(
    'https://portal-api.tradenation.com/TD365/user/6044310/login/',
    {},
    {
      headers: {
        'authority': 'portal-api.tradenation.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7',
        'authorization': `Bearer ${data.access_token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://traders.td365.com',
        'referer': 'https://traders.td365.com/',
        'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }
  );

  console.log(url);

  var { data } = await axios.get('https://portal-api.tradenation.com/TD365/user/6044310/accounts/', {
    headers: {
      'authority': 'portal-api.tradenation.com',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7',
      'authorization': `Bearer ${data.access_token}`,
      'dnt': '1',
      'origin': 'https://traders.td365.com',
      'referer': 'https://traders.td365.com/',
      'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  });

  console.log(data);

  var { data: { url } } = await axios.get('https://portal-api.tradenation.com/TD365/user/6071358/launch/', {
    headers: {
      'authority': 'portal-api.tradenation.com',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,bn;q=0.8',
      'authorization': `Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly90ZDM2NS5ldS5hdXRoMC5jb20vIn0..CFIiEnYmP_8WMX1T.zaVRB97sfYGLyR2yFI5eSNjWcvghhCTJAxsqCj4RamSsFDGacntuJfJRqnOes7JwYygdg4UFVzXWiYAbLg9hX2O90TtgiY5B9Dr6VsIzugPO9PS_RJDsOATaYdcoZ5YebogTTWwNXWh4n3JXiGnRmX0iwL93F780y9bTFm-BKf5UZNVgQZAQdsJt3GKqpBLKZDClEgpOlDcqOQulb0lJ-fa3c5o6cD-CltFOEufu17gzuM1KE1_j6a3n1B3FHjcMZtBbuv5na1f1m1QmehxhESJabX1i4Tj2XuKzZc4Bbl_tZeuklvhgGZ0BhibEgPbguvGoz5vd7Rj_pRzerBJ6RN10Zg.wsdJJw59JIRZ8bchfx3DoA`,
      'dnt': '1',
      'origin': 'https://traders.td365.com',
      'referer': 'https://portal-api.tradenation.com/',
      'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'sec-gpc': '1',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  });

  console.log(url);
}

(() => main())();