import React from 'react'
import classNames from 'classnames'

export const FormGroup = (props) => {
  const classes = classNames({
    'form-group': true,
    'form-group-sm': true,
    'has-error': props.validationMessage && props.validationMessage.length > 0
  })

  const { className, ...messageProps } = props.messageProps

  const messageClassNames = classNames('help-block', className)

  return (
    <div className={classes}>
      {props.children}
      <div className={messageClassNames} {...messageProps}>{props.validationMessage}</div>
    </div>
  )
}

FormGroup.propTypes = Object.assign({}, React.Component.propTypes, {
  messageProps: React.PropTypes.object,
  validationMessage: React.PropTypes.string
})

export default FormGroup
