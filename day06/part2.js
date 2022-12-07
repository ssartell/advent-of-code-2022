import * as R from 'ramda';

const markerSize = 14;
export default R.pipe(R.aperture(markerSize), R.findIndex(R.pipe(R.uniq, R.length, R.equals(markerSize))), R.add(markerSize));