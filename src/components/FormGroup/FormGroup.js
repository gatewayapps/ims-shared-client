import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const FormGroup = (props) => {
  let validationMessageBlock = null

  const hasError = props.validationMessage && props.validationMessage.length > 0

  const classes = classNames({
    'form-group': true,
    'form-group-sm': true,
    'has-error': hasError
  })

  if (hasError) {
    const messageProps = props.messageProps || {}
    const { className, ...helpBlockProps } = messageProps
    const messageClassNames = classNames('help-block', className)
    validationMessageBlock = (
      <div className={messageClassNames} {...helpBlockProps}>
        {props.validationMessage}
      </div>
    )
  }

  return (
    <div className={classes}>
      {props.children}
      {validationMessageBlock}
    </div>
  )
}

FormGroup.propTypes = Object.assign({}, React.Component.propTypes, {
  messageProps: PropTypes.object,
  validationMessage: PropTypes.string
})

export default FormGroup
