import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Notifications from 'react-notification-system-redux'
import { connect } from 'react-redux'

class NotificationContainer extends Component {
  render() {
    return <Notifications notifications={this.props.notifications} />
  }
}
NotificationContainer.propTypes = {
  notifications: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
  const localState = state.toJS()['notifications']
  return {
    notifications: localState
  }
}
export default connect(mapStateToProps)(NotificationContainer)
