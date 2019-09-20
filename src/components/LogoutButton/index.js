import { connect } from 'react-redux'
import { logout } from '../../app/modules/security'
import LogoutButton from './LogoutButton'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  logout
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutButton)
