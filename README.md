# IMS Shared Client
This is a package of shared react client components and utilities for build packages that work with IMS.

## Installation
```bash
$ npm install --save ims-shared-client
```

## Sample Usage
```
import React from 'react'
import { LoadingIndicator } from 'ims-shared-client

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
* DeleteLink - renders a link button that displays a delete confirmation dialog when clicked
* ErrorAlert - renders a Bootstrap error alert box when provided a message
* FormGroup - renders a from group with support for showing validation errors
* LoadingIndicator - spinning circular loading indicator
* RequiredIndicator - renders an asterisk for showing when an input is required
* SortableListHeader - renders a clickable header for a list to change sort order
* UserAutosuggest - renders an auto complete input for selecting user accounts from the IMS hub
