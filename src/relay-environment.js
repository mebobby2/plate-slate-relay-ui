import { createFetcher, createSubscriber } from '@absinthe/socket-relay'
import { Environment, Network, RecordSource, Store, Observable } from 'relay-runtime'

import absintheSocket from './absinthe-socket'

const legacySubscribe = createSubscriber(absintheSocket);

// @absinthe/socket-relay is outdated so wrap it with a fix
const subscribe = (request, variables, cacheConfig) => {
  return Observable.create(sink => {
    legacySubscribe(request, variables, cacheConfig, {
      onNext: sink.next,
      onError: sink.error,
      onCompleted: sink.complete
    });
  });
};

export default new Environment({
  network: Network.create(
    createFetcher(absintheSocket),
    subscribe,
  ),
  store: new Store(new RecordSource()),
})
