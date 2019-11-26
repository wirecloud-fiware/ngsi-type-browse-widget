## v1.0.5 (2019-XX-XX)

- Improve 'Show in a map' feature


## v1.0.4 (2018-06-06)

- Upgrade to use FontAwesome 4
- Use case sensitive `FIWARE-Service` and `FIWARE-ServicePath` values to fix
  some problems


## v1.0.3 (2017-05-10)

- Use updated authentication header names. Support for old names will be removed
  from new versions of WireCloud.

## v1.0.2 (2016-12-12)

- Detect positionable entities (currently based on attribute names) and allow
  the user to display them into a map.
- Use up to date credentials header names


## v1.0.1

- Add support for the Orion Context Broker tenant/service feature including
  support for the `Fiware-ServicePath` header.
- Improved widget metadata
- Use pixels and percentages for the initial size (this requries WireCloud 0.8.0+)
- Update default pagination count to 30
- Experimental support for using the credentials of the dashboard owner. This
  should provide a better experience for sharing workspaces in the future. This
  was documented to be supported by v1.0.0, but in reallity this was not
  available until this version.


## v1.0.0

Initial NGSI type browser version.
