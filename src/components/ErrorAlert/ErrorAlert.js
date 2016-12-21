import React from 'react'

export const ErrorAlert = (props) => {
  if (!props.message) {
    return null
  }

  return (
    <div className='alert alert-danger fade in' role='alert'>
      {props.message}
    </div>
  )
}

ErrorAlert.propTypes = {
  message: React.PropTypes.string
}

export default ErrorAlert
