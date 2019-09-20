import LoggedInUser from './LoggedInUser'
import { createStructuredSelector } from 'reselect'
import { logout, selectCurrentUser } from '../../app'
import { connect } from 'react-redux'

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser()
})

const mapDispatchToProps = {
  logout
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInUser)
