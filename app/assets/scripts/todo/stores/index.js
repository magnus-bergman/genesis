/*
 * This file is part of a sample todo application.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require('babel/polyfill');

import dispatcher from '../dispatcher';
import { EventEmitter } from 'events';
import * as constants from '../constants';

/**
 * This is the application stores, it handles all application data.
 *
 * @author Magnus Bergman <hello@magnus.sexy>
 */

/**
 * @const CHANGE_EVENT
 */
const CHANGE_EVENT = 'change';

/**
 * @const items
 */
const items = {};

/**
 * Create an item.
 *
 * @param {string} text
 *
 * @return void
 */
function create(text) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  items[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update an item.
 *
 * @param {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 *
 * @return void
 */
function update(id, updates) {
  items[id] = Object.assign({}, items[id], updates);
}

/**
 * Update all of the items with the same object.
 * the data to be updated. Used to mark all items as completed.
 *
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 *
 * @return void
 */
function updateAll(updates) {
  for (var id in items) {
    update(id, updates);
  }
}

/**
 * Delete an item.
 *
 * @param {string} id
 *
 * @return void
 */
function destroy(id) {
  delete items[id];
}

/**
 * Delete all the completed items.
 *
 * @return void
 */
function destroyCompleted() {
  for (var id in items) {
    if (items[id].complete) {
      destroy(id);
    }
  }
}

/**
 * Actions handler that deals with all actions depending on type.
 *
 * @param {object} action
 *
 * @return void
 */
function actionsHandler(action) {
  let text = null;

  switch(action.actionType) {
    case constants.CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        Store.emitChange();
      }
      break;

    case constants.TOGGLE_COMPLETE_ALL:
      if (Store.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      Store.emitChange();
      break;

    case constants.UNDO_COMPLETE:
      update(action.id, {complete: false});
      Store.emitChange();
      break;

    case constants.COMPLETE:
      update(action.id, {complete: true});
      Store.emitChange();
      break;

    case constants.UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        Store.emitChange();
      }
      break;

    case constants.DESTROY:
      destroy(action.id);
      Store.emitChange();
      break;

    case constants.DESTROY_COMPLETED:
      destroyCompleted();
      Store.emitChange();
      break;

    default:
      // no op
  }
}

/**
 * Register actions handler to the dispatcher.
 */
dispatcher.register(actionsHandler);

/**
 * This is the Store object.
 * It acts as a singleton with methods handle items.
 */
const Store = Object.assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining items are marked as completed.
   *
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in items) {
      if (!items[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection.
   *
   * @return {object}
   */
  getAll: function() {
    return items;
  },

  /**
   * Emit a change event to update the state of each listener.
   *
   * @return void
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Add listener to the change event.
   *
   * @param {function} callback
   *
   * @return void
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Remove listener from listening to the change event.
   *
   * @param {function} callback
   *
   * @return void
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

export default Store;