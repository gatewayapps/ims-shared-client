import React from 'react'

import Bootstrap3LoggedInUser from './Bootstrap3LoggedInUser'
import Bootstrap4LoggedInUser from './Bootstrap4LoggedInUser'

export default class LoggedInUser extends React.PureComponent {
  render () {
    if (this.props.bootstrapVersion === 3) {
      return <Bootstrap3LoggedInUser {...this.props} logout={this.props.logout} />
    } else {
      return <Bootstrap4LoggedInUser {...this.props} logout={this.props.logout} />
    }
  }
}

LoggedInUser.propTypes = {
  bootstrapVersion: React.PropTypes.number,
  logout: React.PropTypes.func.isRequried
}

LoggedInUser.defaultProps = {
  bootstrapVersion: 3
}
