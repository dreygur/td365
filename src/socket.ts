import WebSocket from 'ws';
import { AllEvents, Auth, ResponseEvent, SubscriptionItem } from './types';

const ws = new WebSocket('wss://demo-api.finsa.com.au');

export default function startListening(
  auth: Auth,
  subscriptions: SubscriptionItem[],
  allEvents: AllEvents,
  callback: (allEvents: AllEvents, data: ResponseEvent) => void): void {
  // On Error
  ws.on('error', console.error);

  // On Connection
  ws.on('open', function open() {
    // Login
    ws.send(JSON.stringify(auth));

    // Subscribe
    subscriptions.forEach(subscription => ws.send(JSON.stringify(subscription)));
  });

  // On Event/Response
  ws.on('message', function message(data) {
    callback(allEvents, JSON.parse(data.toString()));
  });
}