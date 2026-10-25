/** The single rendered state of a merchant's Stripe connection. */
export enum StripeConnectionState {
  NotConnected = 'NotConnected',
  PaymentsOff = 'PaymentsOff',
  Live = 'Live',
}
