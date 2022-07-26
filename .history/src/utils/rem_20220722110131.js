import { Dimensions } from 'react-native';

const DimensionsWidth = Dimensions.get('window').width;
const UiWidthPx = 750;

const pxSize = (uiElementPx) => {
	return uiElementPx * (DimensionsWidth / UiWidthPx);
};

export default pxSize;