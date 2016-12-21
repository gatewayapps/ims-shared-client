import React from 'react'
import classNames from 'classnames'
import '../../styles/SortableListHeader.css'

export class SortableListHeader extends React.Component {
  constructor (props) {
    super(props)
    this._onSortChange = this._onSortChange.bind(this)
  }

  _onSortChange () {
    if (this.props.sortKey === this.props.sort.key) {
      const reverse = !this.props.sort.reverse
      this.props.onSortChange(this.props.sortKey, reverse)
    } else {
      this.props.onSortChange(this.props.sortKey, false)
    }
  }

  render () {
    let sortIndicator = null

    if (this.props.sortKey === this.props.sort.key) {
      const sortClasses = classNames({
        'fa': true,
        'fa-caret-up': this.props.sort.reverse,
        'fa-caret-down': !this.props.sort.reverse
      })
      sortIndicator = (<i className={sortClasses} />)
    }

    return (
      <div className='ims-sortable-header'>
        <a onClick={this._onSortChange}>
          {this.props.children} {sortIndicator}
        </a>
      </div>
    )
  }
}

SortableListHeader.propTypes = Object.assign({}, React.Component.propTypes, {
  sortKey: React.PropTypes.string.isRequired,
  sort: React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    reverse: React.PropTypes.bool.isRequired
  }),
  onSortChange: React.PropTypes.func.isRequired
})

export default SortableListHeader
