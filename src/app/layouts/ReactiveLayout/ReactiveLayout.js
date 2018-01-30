import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import classNames from 'classnames'
import '../../../styles/ReactiveLayout.css'

export default class ReactiveLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, tx: 0, headerHeight: 54, sidebarReady: false }
  }

  toggleSidebar = () => {
    this.setState((prevState, props) => {
      if (prevState.open) {
        return { tx: -this.state.sidebarWidth, open: false }
      } else {
        return { tx: 0, open: true }
      }
    })
  }

  processTouchStart = (e) => {
    if (this.touch) {

    } else {
      this.touch = {
        start: new Date().getTime(),
        x0: e.touches[0].clientX,
        y0: e.touches[0].clientY
      }
    }
  }

  processTouchMove = (e) => {
    if (!this.touch) {
      return
    }
    const now = new Date().getTime()
    const elapsed = now - this.touch.start
    const dx = e.touches[0].clientX - this.touch.x0
    const dy = e.touches[0].clientY - this.touch.y0
    const vx = dx / elapsed
    const vy = dy / elapsed
    if (this.touch.pan) {
      const dx = e.touches[0].clientX - this.touch.x0

      if (this.touch.lx) {
        this.touch.vx = (e.touches[0].clientX - this.touch.lx) / (now - this.touch.lt)
      }
      this.touch.lt = now
      this.touch.lx = e.touches[0].clientX

      const boundedX = Math.max(-this.state.sidebarWidth, Math.min(0, this.touch.sx + dx))

      this.setState((prevState, props) => ({ sidebarReady: true, tx: boundedX, lx: dx, panning: true }))
      // we have decided this is a pan
    } else {
      if (Math.abs(vx) > 0.1 && Math.abs(vy) < 0.25) {
        // this is a panning gesture
        this.touch.sx = this.state.tx
        this.touch.pan = true
      }
    }
  }

  processTouchEnd =(e) => {
    if (this.touch.pan) {
      if (this.touch.vx > 0) {
        this.setState((prevState, props) => ({ tx: 0, panning: false, open: true }))
      } else {
        this.setState((prevState, props) => ({ tx: -this.state.sidebarWidth, panning: false, open: false }))
      }
    }
    delete this.touch
  }

  componentDidMount () {
    const headerHeight = $('nav.navbar').height()
    const sidebarWidth = $('#sidebarContainer').width()
    this.setState((nextState, props) => { return { headerHeight: headerHeight, sidebarWidth: sidebarWidth, tx: -sidebarWidth, sidebarReady: true } })
  }

  renderSidebar () {
    const sidebarStyle = {
      transitionDuration: this.state.panning ? '0s' : '0.25s',
      visibility: this.state.sidebarReady ? 'visible' : 'hidden',
      left: this.state.tx,
      width: 'auto'
    }
    return (
      <div id='sidebarContainer' style={sidebarStyle} className='RLSidebarContainer'>
        {this.props.Sidebar ? this.props.Sidebar : null}
      </div>
    )
  }

  render () {
    return (
      <div onTouchEnd={this.processTouchEnd} onTouchStart={this.processTouchStart} onTouchMove={this.processTouchMove} className='RLContainer'>
        <div id='headerContainer' style={{ height: this.state.headerHeight }} className='RLHeaderContainer'>
          {this.props.Header}
        </div>
        <div className='RLPageContainer'>
          {this.renderSidebar()}
          <div className='RLContentContainer'>
            {this.props.Content}
          </div>
        </div>
      </div>

    )
  }
}

ReactiveLayout.propTypes = {
  Header: PropTypes.element,
  Sidebar: PropTypes.element,
  Content: PropTypes.element
}
