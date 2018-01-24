import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectCurrentUser } from '../../app/modules/security'
import { selectTooltip } from '../../app/modules/tooltips'
import Tooltip from './Tooltip'

const mapStateToProps = (state, ownProps) => {
  return createStructuredSelector({
    tooltip: selectTooltip(ownProps.id),
    user: selectCurrentUser()
  })(state)
}

export default connect(mapStateToProps)(Tooltip)
