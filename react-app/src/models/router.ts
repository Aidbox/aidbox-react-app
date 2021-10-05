import { attach, createDomain, createEffect, forward } from 'effector';
import { createGate } from 'effector-react';

export const routerDomain = createDomain('Router domain');

export const HistoryGate = createGate<any>({ domain: routerDomain });

export const navigateTo = routerDomain.createEvent<string>();

export const $navigate = HistoryGate.state.map(({ navigate }) => navigate);
export const $location = HistoryGate.state.map(({ location }) => location || null);
export const $params = HistoryGate.state.map(({ params }) => params || null);
export const navigateFx = attach({
  source: $navigate,
  mapParams: (pathTo, navigateCallback) => ({ pathTo, navigateCallback }),
  effect: createEffect<any, void, Error>(({ pathTo, navigateCallback }) =>
    navigateCallback(pathTo),
  ),
});

forward({ from: navigateTo, to: navigateFx });
