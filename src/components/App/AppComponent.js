/* eslint-disable camelcase */
import React, { Component } from 'react'
import { Router } from 'react-router'
import NotificationContainer from './Notifications'
import { Provider } from 'react-redux'
import { fetchTooltips } from '../../app/modules/tooltips'
import PropTypes from 'prop-types'
export class AppComponent extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    onAppWillMount: PropTypes.func,
    routes: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    store: PropTypes.object.isRequired
  }

  UNSAFE_componentWillMount() {
    if (this.props.onAppWillMount) {
      this.props.onAppWillMount(this.props.store)
    }
    this.props.store.dispatch(fetchTooltips())
    // Refresh tooltips every 5 minutes
    this.tooltipsRefreshInterval = setInterval(() => {
      this.props.store.dispatch(fetchTooltips())
    }, 5 * 60 * 1000)
  }

  componentWillUnmount() {
    if (this.tooltipsRefreshInterval) {
      clearInterval(this.tooltipsRefreshInterval)
      this.tooltipsRefreshInterval = undefined
    }
  }

  render() {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <NotificationContainer />
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppComponent
