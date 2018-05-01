import { Tracker } from 'meteor/tracker';

const getTrackerLoader = reactiveMapper => (props, onData, env) => {
  let trackerCleanup = null;
  const handler = Tracker.nonreactive(() => Tracker.autorun(() => {
        // assign the custom clean-up function.
    trackerCleanup = reactiveMapper(props, onData, env);
  }));

  return () => {
    if (typeof trackerCleanup === 'function') trackerCleanup();

    return handler.stop();
  };
};

export default getTrackerLoader;
