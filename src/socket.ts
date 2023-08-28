import WebSocket from 'ws';
import { AllEvents, Auth, ResponseEvent, SubscriptionItem } from './types';

const ws = new WebSocket('wss://demo-api.finsa.com.au');

export function startListening(
  auth: Auth,
  subscriptions: SubscriptionItem[],
  allEvents: AllEvents,
  callback: (allEvents: AllEvents, data: ResponseEvent, func: () => void) => void): void {
  const subscribe = () => subscriptions.forEach(subscription => ws.send(JSON.stringify(subscription)));
  const login = () => startListening(auth, subscriptions, allEvents, callback);
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
    else if (event.t === 'authenticationResponse' && !event.d.HasError) subscribe();
    else callback(allEvents, event, subscribe);
  });
}