import WebSocket from 'ws';
import { AllEvents, Auth, ResponseEvent, SubscriptionItem } from './types';

export function startListening(
  auth: Auth,
  subscriptions: SubscriptionItem[],
  allEvents: AllEvents,
  callback: (allEvents: AllEvents, data: ResponseEvent, func: () => void) => void,
  secondCallBack?: () => void
): void {
  const ws = new WebSocket('wss://demo-api.finsa.com.au');

  const subscribe = () => subscriptions.forEach(subscription => {
    ws.send(JSON.stringify(subscription));
    console.log(subscription, 'Done!')
  });
  const login = () => startListening(auth, subscriptions, allEvents, callback, secondCallBack);
  // On Error
  ws.on('error', console.error);

  // On Event/Response
  ws.on('message', function message(data) {
    const event: ResponseEvent = JSON.parse(data.toString());
    // console.log(event);

    if (event.t === 'heartbeat') ws.send(JSON.stringify(event.d));
    else if (event.t === 'connectResponse') ws.send(JSON.stringify(auth));
    else if (event.t === 'authenticationResponse' && event.d.HasError) login();
    else if (event.t === 'authenticationResponse' && !event.d.HasError) {
      subscribe();
      secondCallBack && secondCallBack();
    }
    else callback(allEvents, event, subscribe);
  });
}