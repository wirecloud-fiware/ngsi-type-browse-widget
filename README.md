NGSI Type Browser widget 
========================

The NGSI Type Browser widgets allows you to browser the entities types used in
a given [Orion Context
Broker](http://catalogue.fiware.org/enablers/publishsubscribe-context-broker-orion-context-broker)
server in a easy and paginated way. This is done using the `contextTypes` querys, so
updates made into the context broker are not reflected immediately when using
this widget.

> Latest version of this widget is always provided in [FIWARE
> Lab](https://store.lab.fiware.org/search/keyword/OrionStarterKit) where you
> can make use of it on the [Mashup portal](https://mashup.lab.fiware.org).
> Remember to take a look into the example mashups provided in the OrionStarterKit offering.

Build
-----

Be sure to have installed [Node.js](http://node.js). For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
```

Install other npm dependencies by running:

```bash
npm install
```

For build the widget you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

Settings and Usage
------------------

### Settings

- **NGSI server URL:** URL of the Orion Context Broker to use for retrieving
  entity information.
- **Use the FIWARE credentials of the user:** Use the FIWARE credentials of the
  user logged into WireCloud. Take into account this option cannot be enabled if
  you want to use this widget in a public workspace as anonoymous users doesn't
  have a valid FIWARE auth token. As an alternative, you can make use of the
  "Use the FIWARE credentials of the workspace owner" preference.
- **Use the FIWARE credentials of the dashboard owner**: Use the FIWARE
  credentials of the owner of the workspace. This preference takes preference
  over "Use the FIWARE credentials of the user". This feature is available on
  WireCloud 0.7.0+ in a experimental basis, future versions of WireCloud can
  change the way to use it making this option not funcional and requiring you to
  upgrade this widget.
- **NGSI tenant/service**: Tenant/service to use when connecting to the context
  broker. Must be a string of alphanumeric characters (lowercase) and the `_`
  symbol. Maximum length is 50 characters. If empty, the default tenant will be
  used
- **NGSI scope**: Scope/path to use when connecting to the context broker. Must
  be a string of alphanumeric characters (lowercase) and the `_` symbol
  separated by `/` slashes. Maximum length is 50 characters. If empty, the
  default service path will be used: `/`

### Wiring

##### Input Endpoints

- This widget has no input endpoint

##### Output Endpoints

- **Selection**: always an user clicks on a row, an event is sent using this
  endpoint and providing info about the selected type. This data is encoded
  using JSON. E.g.:

    ```json
    {
        "name": "Agrarium",
        "attributes": ["moisture", "ambientLight", "position", "humidity", "temperature"]
    }
    ```

Copyright and License
---------------------

Copyright (c) 2015 CoNWeT Lab., Universidad Politecnica de Madrid

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
