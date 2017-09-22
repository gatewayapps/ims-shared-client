import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import NotificationContainer from './Notifications'
import { Provider } from 'react-redux'

export class AppComponent extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    onAppWillMount: PropTypes.func,
    routes: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]).isRequired,
    store: PropTypes.object.isRequired
  }

  componentWillMount () {
    if (this.props.onAppWillMount) {
      this.props.onAppWillMount(this.props.store)
    }
  }

  render () {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div>
          <NotificationContainer />
          <Router history={history} children={routes} />

        </div>
      </Provider>
    )
  }
}

export default AppComponent
