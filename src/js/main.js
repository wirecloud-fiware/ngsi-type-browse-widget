/*
 * Copyright (c) 2015-2016 CoNWeT Lab., Universidad Politécnica de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global NGSI, StyledElements */

(function () {

    "use strict";

    var NGSITypeBrowser = function NGSITypeBrowser() {

        /* Context */
        MashupPlatform.widget.context.registerCallback(function (newValues) {
            if (this.layout && ("heightInPixels" in newValues || "widthInPixels" in newValues)) {
                this.layout.repaint();
            }
        }.bind(this));

        /* Preferences */
        MashupPlatform.prefs.registerCallback(function (newValues) {
            if ('ngsi_server' in newValues || 'use_user_fiware_token' in newValues || 'use_owner_credentials' in newValues || 'ngsi_tenant' in newValues || 'ngsi_service_path' in newValues) {
                this.updateNGSIConnection();
            }

            this.ngsi_source.goToFirst();
        }.bind(this));

        this.layout = null;
        this.table = null;
    };

    NGSITypeBrowser.prototype.init = function init() {
        createNGSISource.call(this);
        this.updateNGSIConnection();

        this.layout = new StyledElements.VerticalLayout();
        createTable.call(this);

        this.layout.center.addClassName('loading');
        this.layout.insertInto(document.body);
    };

    NGSITypeBrowser.prototype.updateNGSIConnection = function updateNGSIConnection() {

        this.ngsi_server = MashupPlatform.prefs.get('ngsi_server');
        var options = {
            request_headers: {},
            use_user_fiware_token: MashupPlatform.prefs.get('use_user_fiware_token')
        };
        if (MashupPlatform.prefs.get('use_owner_credentials')) {
            options.request_headers['FIWARE-OAuth-Token'] = 'true';
            options.request_headers['FIWARE-OAuth-Header-Name'] = 'X-Auth-Token';
            options.request_headers['FIWARE-OAuth-Source'] = 'workspaceowner';
        }

        var tenant = MashupPlatform.prefs.get('ngsi_tenant').trim().toLowerCase();
        if (tenant !== '') {
            options.request_headers['FIWARE-Service'] = tenant;
        }

        var path = MashupPlatform.prefs.get('ngsi_service_path').trim().toLowerCase();
        if (path !== '' && path !== '/') {
            options.request_headers['FIWARE-ServicePath'] = path;
        }

        this.ngsi_connection = new NGSI.Connection(this.ngsi_server, options);
    };

    /* *************************************************************************/
    /* ***************************** HANDLERS **********************************/
    /* *************************************************************************/

    var onRowClick = function onRowClick(row) {
        if (!MashupPlatform.prefs.get("allow_use")) {
            MashupPlatform.wiring.pushEvent('selected-row', row);
        }
    };

    var onNGSIQuerySuccess = function onNGSIQuerySuccess(next, page, data, details) {
        for (var i = 0; i < data.length; i++) {
            if (!Array.isArray(data[i].attributes)) {
                data[i].attributes = [];
            }
        }

        var search_info = {
            'resources': data,
            'current_page': page,
            'total_count': details.count
        };

        next(data, search_info);
    };

    var createNGSISource = function createNGSISource() {
        this.ngsi_source = new StyledElements.PaginatedSource({
            'pageSize': 30,
            'requestFunc': function (page, options, onSuccess, onError) {
                if (this.ngsi_connection !== null) {
                    this.ngsi_connection.getAvailableTypes({
                        limit: options.pageSize,
                        offset: (page - 1) * options.pageSize,
                        onSuccess: onNGSIQuerySuccess.bind(null, onSuccess, page),
                        onFailure: onError
                    });
                } else {
                    onSuccess([], {resources: [], total_count: 0, current_page: 0});
                }
            }.bind(this)
        });
        this.ngsi_source.addEventListener('requestStart', function () {
            this.layout.center.disable();
        }.bind(this));
        this.ngsi_source.addEventListener('requestEnd', function () {
            this.layout.center.enable();
        }.bind(this));
    };

    var listBuilder = function listBuilder(row) {
        return row.attributes.join(', ');
    };

    var createTable = function createTable() {
        var fields;

        // Create the table
        fields = [
            {field: 'name', label: 'Type', sortable: false, width: "20%"},
            {field: 'attributes', label: 'Attributes', sortable: false, contentBuilder: listBuilder}
        ];

        if (MashupPlatform.prefs.get('allow_map') || MashupPlatform.prefs.get('allow_use')) {
            fields.push({
                label: 'Actions',
                width: '100px',
                contentBuilder: function (entry) {
                    var content, button;

                    content = new StyledElements.Fragment();

                    if (MashupPlatform.prefs.get('allow_map')) {
                        var attr_low = entry.attributes.map(function (attr) {return attr.toLowerCase();});
                        button = new StyledElements.Button({'class': 'btn-success', 'iconClass': 'fa fa-map fa-fw', 'title': 'Show in a map'});
                        var position_attrs = [];
                        ['position', 'current_position'].some(function (attr_name) {
                            if (attr_low.indexOf(attr_name) !== -1) {
                                position_attrs.push(attr_name);
                                return true;
                            }
                            return false;
                        });
                        button.enabled = position_attrs.length > 0;
                        button.addEventListener("click", function () {
                            var source = MashupPlatform.mashup.addOperator('CoNWeT/ngsi-source/3.0.7', {
                                "preferences": {
                                    "ngsi_server": {"value": MashupPlatform.prefs.get("ngsi_server")},
                                    "ngsi_entities": {"value": entry.name},
                                    "ngsi_update_attributes": {"value": position_attrs.join(', ')}
                                }
                            });
                            var adapter = MashupPlatform.mashup.addOperator('CoNWeT/ngsientity2poi/3.0.3', {
                                "preferences": {
                                    "coordinates_attr": {"value": position_attrs.join(', ')}
                                }
                            });
                            var map = MashupPlatform.mashup.addWidget('CoNWeT/map-viewer/2.5.8', {
                                "refposition": button.getBoundingClientRect()
                            });

                            source.outputs.entityOutput.connect(adapter.inputs.entityInput);
                            adapter.outputs.poiOutput.connect(map.inputs.poiInput);

                        }.bind(this));
                        content.appendChild(button);
                    }

                    if (MashupPlatform.prefs.get('allow_use')) {
                        button = new StyledElements.Button({'class': 'btn-primary', 'iconClass': 'icon-play', 'title': 'Use'});
                        button.addEventListener("click", function () {
                            MashupPlatform.wiring.pushEvent('selection', JSON.stringify(entry));
                        }.bind(this));
                        content.appendChild(button);
                    }

                    return content;
                }.bind(this),
                sortable: false
            });
        }

        // Create the table
        this.table = new StyledElements.ModelTable(fields, {id: 'name', pageSize: 30, source: this.ngsi_source, 'class': 'table-striped'});
        this.table.addEventListener("click", onRowClick);
        this.table.reload();
        this.layout.center.clear();
        this.layout.center.appendChild(this.table);
    };

    var widget = new NGSITypeBrowser();
    window.addEventListener("DOMContentLoaded", widget.init.bind(widget), false);

})();
