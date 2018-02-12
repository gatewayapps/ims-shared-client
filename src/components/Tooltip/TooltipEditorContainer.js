import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  cancelEdit,
  changeContent,
  changeLink,
  saveTooltip,
  selectIsSaving,
  selectEditTooltip
} from '../../app/modules/tooltips'
import TooltipEditor from './TooltipEditor'

const mapStateToProps = (state, ownProps) => {
  return createStructuredSelector({
    isSaving: selectIsSaving(ownProps.tooltipId),
    tooltip: selectEditTooltip(ownProps.tooltipId)
  })(state)
}

const mapDispatchToProps = {
  cancelEdit,
  changeContent,
  changeLink,
  saveTooltip
}

export default connect(mapStateToProps, mapDispatchToProps)(TooltipEditor)
