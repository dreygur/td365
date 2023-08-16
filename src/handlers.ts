import { AllEvents, ResponseEvent } from "./types";

export function handleEvent(allEvents: AllEvents, event: ResponseEvent, callback: () => void): void {
  switch (event.t) {
    case 'error':
      callback();
      break;
    case "subscribeResponse":
      if (event.d.HasError || !event.d.Current) break;
      event.d.Current.forEach(resp => {
        const data = resp.split(',');
        allEvents[data[0]] = {
          sellPrice: data[1],
          buyPrice: data[2],
          high: data[6],
          low: data[7],
          token: data[8]
        };
      });
      break;
    case 'p':
      if (!event.d.sp) break;
      event.d.sp.forEach(resp => {
        const data = resp.split(',');
        allEvents[data[0]] = {
          sellPrice: data[1],
          buyPrice: data[2],
          high: data[6],
          low: data[7],
          token: data[8]
        };
      });
      break;
    case 'authenticationResponse':
      if (event.d.HasError) console.log('[-] Auth Failed');
      else console.log('[+] Successfully authenticated');
    default:
      // console.log(JSON.stringify(event));
      break;
  }
}