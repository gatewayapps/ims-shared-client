import React from 'react'

import Bootstrap3Header from './Bootstrap3Header'
import Bootstrap4Header from './Bootstrap4Header'

export default class Header extends React.PureComponent {
  render () {
    if (this.props.bootstrapVersion === 3) {
      return <Bootstrap3Header {...this.props} />
    } else {
      return <Bootstrap4Header {...this.props} />
    }
  }
}

Header.propTypes = {
  bootstrapVersion: React.PropTypes.number
}

Header.defaultProps = {
  bootstrapVersion: 3
}
