import { Dimensions, useWindowDimensions  } from 'react-native';

const DimensionsWidth = Dimensions.get('window').width;
const UiWidthPx = 750;
const scale = useWindowDimensions().scale;

const _rem = (uiElementPx) => {
	console.log('screen-height',Dimensions.get('screen').height);
	console.log('window-height',Dimensions.get('window').height);
	console.log('window-scale',scale);
	return uiElementPx * (DimensionsWidth / UiWidthPx);
};

export default _rem;