import React from 'react'
import $ from 'jquery'

import '../../../styles/CoreLayout.css'

export default class CoreLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = { headerHeight: 54 }
  }

  componentDidMount () {
    const headerHeight = $('nav.navbar').height()
    this.setState((nextState, props) => { return { headerHeight: headerHeight } })
  }

  render () {
    return (
      <div className='CLContainer'>
        <div style={{ height: this.state.headerHeight }} className='CLHeaderContainer'>
          {this.props.Header}
        </div>
        <div className='CLPageContainer'>
          <div className='CLContentContainer'>
            {this.props.Content}
          </div>
        </div>
      </div>

    )
  }
}

CoreLayout.propTypes = {
  Header: React.PropTypes.element,
  Content: React.PropTypes.element
}
