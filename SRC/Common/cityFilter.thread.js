import { self } from 'react-native-threads';

self.onmessage = message => {
  const { cityData, selectedDepId } = message;

  const depIdSet = new Set(selectedDepId.map(Number));
  const filtered = cityData.filter(c => depIdSet.has(parseInt(c.depId)));

  // Send result back to main thread
  self.postMessage(filtered);
};