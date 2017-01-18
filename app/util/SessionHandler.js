/**
 * # AppAuthToken.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 */

import store from 'react-native-simple-store';

const USER = 'USER';


/**
* Middleware that stores the accessToken on the device, when a user logs in.
* Or deletes it when the user logs out
*/
export default class SessionHandler {
  /**
   * ## AppAuthToken
   *
   * set the key from the config
   */
  constructor() {
    this.USER = USER;
  }

  storeSessionUser(user) {
    return store.save(this.USER, user);
  }
  /**
   * ### getSessionUser
   */
  getSessionUser() {
    return store.get(this.USER);
  }

  /**
   * ### deleteSessionUser
   * Deleted during log out
   */
  deleteSessionUser() {
    return store.delete(this.USER);
  }
}
