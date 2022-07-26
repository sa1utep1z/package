
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  console.log('navigationRef',navigationRef)
  if (navigationRef.isReady()) {
    console.log('进来了路由这里了');
    // navigationRef.navigate(name, params);
  }
}
