
import { createNavigationContainerRef } from '@react-navigation/native';
import NAVIGATION_KEYS from './key';

export const navigationRef = createNavigationContainerRef()

//返回登录
export function resetLogin() {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [{
        name: NAVIGATION_KEYS.LOGIN
        //TODO
      }]
    })
  }
}
