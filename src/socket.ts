import WebSocket from 'ws';
import { AllEvents, Auth, ResponseEvent, SubscriptionItem } from './types';

export function startListening(
  auth: Auth,
  subscriptions: SubscriptionItem[],
  allEvents: AllEvents,
  callback: (allEvents: AllEvents, data: ResponseEvent, func: () => void) => void,
  secondCallBack: () => void
): void {
  const ws = new WebSocket('wss://demo-api.finsa.com.au');

  const subscribe = () => subscriptions.forEach(subscription => ws.send(JSON.stringify(subscription)));
  const login = () => startListening(auth, subscriptions, allEvents, callback, secondCallBack);
  // On Error
  ws.on('error', console.error);

  // On Connection
  ws.on('open', function open() {
    // Login
    ws.send(JSON.stringify(auth));

    // Subscribe
    // subscribe()
  });


  // On Event/Response
  ws.on('message', function message(data) {
    const event: ResponseEvent = JSON.parse(data.toString());
    if (event.t === 'heartbeat') ws.send(JSON.stringify(event.d));
    else if (event.t === 'authenticationResponse' && event.d.HasError) login();
    else if (event.t === 'authenticationResponse' && !event.d.HasError) {
      subscribe();
      secondCallBack();
    }
    else callback(allEvents, event, subscribe);

    if (event.t === 'heartbeat') ws.send(JSON.stringify(event.d));
    else callback(allEvents, event, subscribe);

    // Unnecessary But Asked by @jayeen28
    if (event.t === 'authenticationResponse' && !event.d.HasError) {
      secondCallBack();
    }
  });
}