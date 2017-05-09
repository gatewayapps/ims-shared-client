# IMS Shared Client
This is a package of shared react client components and utilities for build packages that work with IMS.

## Installation
```bash
$ npm install --save ims-shared-client
```

## Version 3.0 Breaking change
Version 3.0 introduces a PackageInformation object that must be created at the app launch. You must call PackageInformation.configure with your package information.

```js
import { PackageInformation } from 'ims-shared-client'
const packageInfo = require('../shared/ims.js')
PackageInformation.configure(packageInfo)
```

If you do not, BaseComponent, ScopedComponent, request, and SecureLink will not work correctly.

To do:
- Refactor FeedbackButton to use PackageInformation
- Refactor ReleaseNotesButton to use PackageInformation

## Version 2.0 Breaking change
Version 2.0 introduces a new version of the request library that is connected with the redux store. Components from the shared library such as UserAutosuggest and AreaPicker require the request library be prepared to be used.

Example: app/store/createStore.js

```js
/// Other imports here
import { prepareRequest } from 'ims-shared-client/request'

/// Later in file...
  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    fromJS(initialState),
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  prepareRequest(store, 'global.tokens')
```

### Using request in modules

```js
import request from 'ims-shared-client/request'


function* mySaga (action) {
  yield call(request, '/api/endpoint', requestOptions)
}
```

## Sample Usage
```js
import React from 'react'
import { LoadingIndicator } from 'ims-shared-client'

class MyComponent extends React.Component {
  render () {
    return (
      <LoadingIndicator />
    )
  }
}
```

### Styles
This package requires that Twitter Bootstrap (e.g. ```bootstrap.min.css``` ) be included in your page to render properly.

## React Components
* ActionLink - renders a link button for invoking an action
* AreaPicker - select an area from the IMS Hub areas tree
* BaseComponent - provides a checkPermission method
* DeleteLink - renders a link button that displays a delete confirmation dialog when clicked
* DisplayName - Given a user either renders the displayName or firstName + lastName
* EquipmentAutosuggest - renders an auto complete input for selecting equipment from the IMS hub
* ErrorAlert - renders a Bootstrap error alert box when provided a message
* FileUploader - renders a wrapper that can receive file drops and upload them
* FormGroup - renders a from group with support for showing validation errors
* LoadingIndicator - spinning circular loading indicator
* RequiredIndicator - renders an asterisk for showing when an input is required
* ScopedBaseComponent - a base component that has its own scope
* ScopedComponent - Can inject its own reducer
* SingleUserSelector - renders a component that toggles the UserAutosuggest for selecting a single user
* SortableListHeader - renders a clickable header for a list to change sort order
* UserAutosuggest - renders an auto complete input for selecting user accounts from the IMS hub
* Utilities 
..* IconHelper - getIconForMimeType(mimeType) - returns font-awesome icon for a given mime type
