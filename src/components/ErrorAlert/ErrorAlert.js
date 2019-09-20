import React from 'react'
import PropTypes from 'prop-types'

export const ErrorAlert = (props) => {
  if (!props.message) {
    return null
  }

  return (
    <div className="alert alert-danger fade in" role="alert">
      {props.message}
    </div>
  )
}

ErrorAlert.propTypes = {
  message: PropTypes.string
}

export default ErrorAlert
