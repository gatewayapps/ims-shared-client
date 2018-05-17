import React from 'react'

import Bootstrap3LoggedInUser from './Bootstrap3LoggedInUser'
import Bootstrap4LoggedInUser from './Bootstrap4LoggedInUser'

export default class LoggedInUser extends React.PureComponent {
  render () {
    if (this.props.bootstrapVersion === 3) {
      return <Bootstrap3LoggedInUser {...this.props} />
    } else {
      return <Bootstrap4LoggedInUser {...this.props} />
    }
  }
}

LoggedInUser.propTypes = {
  bootstrapVersion: React.PropTypes.number
}

LoggedInUser.defaultProps = {
  bootstrapVersion: 3
}
