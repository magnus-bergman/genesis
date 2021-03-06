/*
 * This file is part of a sample todo application.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react'
import Radium from 'radium'

import * as colors from '../utils/colors'

import Actions from '../Actions/'

/**
 * This is the Controls component class.
 */
@Radium
export default class Controls extends Component {

  /**
   * Declare component property types.
   *
   * @type {Object}
   */
  static propTypes = {
    allItems: PropTypes.object.isRequired
  }

  /**
   * Initiate and set state for the component.
   *
   * @param {object} props
   *
   * @return void
   */
  constructor (props) {
    super(props)
  }

  /**
   * Event handler that deletes all completed TODO's.
   *
   * @return void
   */
  onClearCompletedClick () {
    Actions.destroyCompleted()
  }

  /**
   * Render react component.
   *
   * @return {object}
   */
  render () {
    const { allItems } = this.props
    const total = Object.keys(allItems).length

    if (total === 0) return null

    let completed = 0

    for (const key in allItems) {
      if (allItems.hasOwnProperty(key) && allItems[key].complete) {
        completed++
      }
    }

    const itemsLeft = total - completed

    let clearCompletedButton = null

    if (completed > 0) {
      clearCompletedButton = (
        <button
          style={styles.clearCompletedButton}
          onClick={this.onClearCompletedClick.bind(this)}>
          Clear completed ({completed})
        </button>
      )
    }

    return (
      <footer style={styles.base}>
        <p>
          <small>Double click a todo to edit its content.</small>
        </p>
        <div style={styles.meta}>
          <span>
            <strong>{itemsLeft}</strong> {itemsLeft > 1 ? 'items' : 'item'} left
          </span>
          {clearCompletedButton}
        </div>
      </footer>
    )
  }

}

const styles = {
  base: {
    marginTop: '2em',
    textAlign: 'center'
  },

  meta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '.6em'
  },

  clearCompletedButton: {
    marginLeft: '1em',
    padding: '.4em 1em',

    border: '1px solid ' + colors.base,
    boxShadow: 'none',
    background: 'transparent'
  }
}
