/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';

/**
 * @private
 * @hide
 */
export default class AbstractHelper extends Helper {
  intl = null;
  unsubscribeLocaleChanged = null;
  constructor() {
    super(...arguments);
    if (this.constructor === AbstractHelper) {
      throw new Error('FormatHelper is an abstract class, can not be instantiated directly.');
    }

    this.intl = getOwner(this).lookup('service:intl');
    this.unsubscribeLocaleChanged = this.intl.onLocaleChanged(this.recompute, this);
  }

  format() {
    throw new Error('not implemented');
  }

  compute([value], options) {
    if (isEmpty(value)) {
      if (options.allowEmpty ?? this.allowEmpty) {
        return;
      }

      if (typeof value === 'undefined') {
        throw new Error(`${this} helper requires value attribute.`);
      }
    }

    return this.format(value, options);
  }

  willDestroy() {
    super.willDestroy();
    this.unsubscribeLocaleChanged();
  }
}
