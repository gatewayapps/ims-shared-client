import { connect } from 'react-redux'
import { selectPackages } from '../../app/modules/packages'
import { createStructuredSelector } from 'reselect'

import PackagesDropdown from './PackagesDropdown'

const mapDispatchToProps = {

}

const mapStateToProps = createStructuredSelector({
  packages: selectPackages()

})

export default connect(mapStateToProps, mapDispatchToProps)(PackagesDropdown)
