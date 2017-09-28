/**
 * Copyright 2017 F5 Networks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';


var q = require('q');
var httpUtil = require('./httpUtil');

/**
 * @module
 */
module.exports = {
    upload: function(trackingId, metrics) {

        const METRICS_URL = 'https://www.google-analytics.com/collect';
        const headers = {
            'User-Agent': 'Mozilla/5.0'
        };

        var payload = '';
        if (!trackingId) {
            return q.reject(new Error('tracking id is required'));
        }

        if (!metrics.customerId) {
            return q.reject(new Error('customer id is required'));
        }

        payload = addMetricsComponent(payload, 'v', '1');
        payload = addMetricsComponent(payload, 't', 'event');
        payload = addMetricsComponent(payload, 'ec', 'run');
        payload = addMetricsComponent(payload, 'tid', trackingId);
        payload = addMetricsComponent(payload, 'cid', metrics.customerId);
        payload = addMetricsComponent(payload, 'ea', metrics.action || 'unknown');
        payload = addMetricsComponent(payload, 'an', metrics.templateName);
        payload = addMetricsComponent(payload, 'aid', metrics.deploymentId);
        payload = addMetricsComponent(payload, 'av', metrics.templateVersion);
        payload = addMetricsComponent(payload, 'cn', metrics.cloudName);
        payload = addMetricsComponent(payload, 'cm', metrics.region);
        payload = addMetricsComponent(payload, 'cs', metrics.bigIpVersion);
        payload = addMetricsComponent(payload, 'ck', metrics.licenseType);
        payload = addMetricsComponent(payload, 'ds', metrics.cloudLibsVersion);

        return httpUtil.post(METRICS_URL, {headers: headers, body: payload});
    }
};

var addMetricsComponent = function(payload, metric, data) {
    if (data) {
        return payload + '&' + metric + '=' + encodeURIComponent(data);
    }
    else {
        return payload;
    }
};