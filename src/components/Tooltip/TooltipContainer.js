import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectCurrentUser } from '../../app/modules/security'
import {
  beginEdit,
  cancelEdit,
  selectIsEditing,
  selectTooltip
} from '../../app/modules/tooltips'
import Tooltip from './Tooltip'

const mapStateToProps = (state, ownProps) => {
  return createStructuredSelector({
    isEditing: selectIsEditing(ownProps.id),
    tooltip: selectTooltip(ownProps.id),
    user: selectCurrentUser()
  })(state)
}

const mapDispatchToProps = {
  beginEdit,
  cancelEdit
}

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip)
