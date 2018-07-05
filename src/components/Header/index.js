import { connect } from 'react-redux'
import React from 'react'
import { logout } from '../../app/modules/security'
import Bootstrap3Header from './Bootstrap3Header'
import Bootstrap4Header from './Bootstrap4Header'

class Header extends React.PureComponent {
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

const mapStateToProps = (state, ownProps) => { return ownProps }

const mapDispatchToProps = {
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
