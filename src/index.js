// Components =============================
import ActionLink from './components/ActionLink'
import AreaPicker from './components/AreaPicker'
import BaseComponent from './components/BaseComponent'
import Card from './components/Card'
import Conditional from './components/Conditional'
import ConfirmationModal from './components/ConfirmationModal'
import DeleteLink from './components/DeleteLink'
import DisplayName from './components/DisplayName'
import EquipmentAutosuggest from './components/EquipmentAutosuggest'
import ErrorAlert from './components/ErrorAlert'
import FileUploader from './components/FileUploader'
import FormGroup from './components/FormGroup'
import Image from './components/Image'
import LoadingIndicator from './components/LoadingIndicator'
import LogoutButton from './components/LogoutButton'
import NodePath from './components/NodePath'
import PackagesDropdown from './components/PackagesDropdown'
import PersonCard from './components/PersonCard'
import RequiredIndicator from './components/RequiredIndicator'
import PermissionCheck from './components/PermissionCheck'
import SecureRoute from './components/SecureRoute'
import ScopedBaseComponent from './components/ScopedBaseComponent'
import FeedbackButton from './components/FeedbackButton'
import ReleaseNotesButton from './components/ReleaseNotesButton'
import ScopedComponent from './components/ScopedComponent'
import SecureLink from './components/SecureLink'
import SingleUserSelector from './components/SingleUserSelector'
import SortableListHeader from './components/SortableListHeader'
import UserAutosuggest from './components/UserAutosuggest'
import Notifications from 'react-notification-system-redux'
import UserProfileImage from './components/UserProfileImage'

import PackageInformation from './PackageInformation'

// ========================================

// Utilities ===============================
import { getAuthorizeUrl } from './utils/auth'
import Cookies from './utils/cookies'
import IconHelper from './utils/IconHelper'
import connectScoped from './utils/ConnectScoped'
import { prepareInjector, injectScopedReducer } from './utils/injectScopedReducer'
import LocalStorage from './utils/localStorage'
import { setLocation } from './utils/window'

// =========================================

module.exports = {
  ActionLink: ActionLink,
  AreaPicker: AreaPicker,
  BaseComponent: BaseComponent,
  Card: Card,
  Conditional: Conditional,
  ConfirmationModal: ConfirmationModal,
  DeleteLink: DeleteLink,
  DisplayName: DisplayName,
  EquipmentAutosuggest: EquipmentAutosuggest,
  ErrorAlert: ErrorAlert,
  FeedbackButton: FeedbackButton,
  ReleaseNotesButton: ReleaseNotesButton,
  FileUploader: FileUploader,
  FormGroup: FormGroup,
  Image: Image,
  LoadingIndicator: LoadingIndicator,
  LogoutButton: LogoutButton,
  NodePath: NodePath,
  PackagesDropdown: PackagesDropdown,
  PermissionCheck: PermissionCheck,
  PersonCard: PersonCard,
  RequiredIndicator: RequiredIndicator,
  ScopedBaseComponent: ScopedBaseComponent,
  ScopedComponent: ScopedComponent,
  SecureLink: SecureLink,
  SecureRoute: SecureRoute,
  SingleUserSelector: SingleUserSelector,
  SortableListHeader: SortableListHeader,
  UserAutosuggest: UserAutosuggest,
  UserProfileImage: UserProfileImage,
  Utils: {
    Cookies: Cookies,
    IconHelper: IconHelper,
    connectScoped: connectScoped,
    getAuthorizeUrl: getAuthorizeUrl,
    injectScopedReducer: injectScopedReducer,
    LocalStorage: LocalStorage,
    prepareScopedInjector: prepareInjector,
    setLocation: setLocation
  },
  Notifications: Notifications,
  PackageInformation: PackageInformation
}
