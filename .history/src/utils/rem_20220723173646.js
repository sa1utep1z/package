import { Dimensions } from 'react-native';

const DimensionsWidth = Dimensions.get('window').width;
const UiWidthPx = 750;

const _rem = (uiElementPx) => {
	console.log('DimensionsWidth',DimensionsWidth);
	return uiElementPx * (DimensionsWidth / UiWidthPx);
};

export default _rem;