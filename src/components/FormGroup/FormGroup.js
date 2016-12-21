import React from 'react'
import classNames from 'classnames'

export const FormGroup = (props) => {
  const classes = classNames({
    'form-group': true,
    'form-group-sm': true,
    'has-error': props.validationMessage && props.validationMessage.length > 0
  })

  return (
    <div className={classes}>
      {props.children}
      <div className='help-block'>{props.validationMessage}</div>
    </div>
  )
}

FormGroup.propTypes = Object.assign({}, React.Component.propTypes, {
  validationMessage: React.PropTypes.string
})

export default FormGroup
