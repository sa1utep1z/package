import { Dimensions,  } from 'react-native';

const DimensionsWidth = Dimensions.get('window').width;
const UiWidthPx = 750;

const _rem = (uiElementPx) => {
	console.log('screen-height',Dimensions.get('screen').height);
	console.log('window-height',Dimensions.get('window').height);
	return uiElementPx * (DimensionsWidth / UiWidthPx);
};

export default _rem;