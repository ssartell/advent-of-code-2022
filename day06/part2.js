import * as R from 'ramda';

const markerSize = 14;
const findFirstMarker = R.pipe(R.aperture(markerSize), R.find(R.pipe(R.uniq, R.length, R.equals(markerSize))), R.join(''));

export default R.pipe(R.converge(R.indexOf, [findFirstMarker, R.identity]), R.add(markerSize));