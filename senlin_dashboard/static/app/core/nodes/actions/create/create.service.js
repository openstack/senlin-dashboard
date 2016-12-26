/**
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc factory
   * @name horizon.cluster.nodes.actions.create.service
   * @description
   * Service for the cluster node create modal
   */
  angular
    .module('horizon.cluster.nodes.actions')
    .factory('horizon.cluster.nodes.actions.create.service', createService);

  createService.$inject = [
    '$location',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.senlin',
    'horizon.app.core.nodes.basePath',
    'horizon.app.core.nodes.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.cluster.nodes.actions.workflow'
  ];

  function createService(
    $location, policy, senlin, basePath, resourceType, actionResult, gettext,
    $qExtensions, modal, toast, workflow
  ) {

    var message = {
      success: gettext('Node %s was successfully created.')
    };

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initAction() {
    }

    function perform() {
      // modal title, buttons
      var title, submitText, submitIcon, helpUrl;
      title = gettext('Create Node');
      submitText = gettext('Create');
      submitIcon = 'fa fa-check';
      helpUrl = basePath + 'actions/create/node.help.html';

      var config = workflow.init('create', title, submitText, submitIcon, helpUrl);
      return modal.open(config).then(submit);
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['cluster', 'nodes:create']] });
    }

    function submit(context) {
      delete context.model.id;
      return senlin.createNode(context.model, true).then(success, true);
    }

    function success(response) {
      toast.add('success', interpolate(message.success, [response.data.id]));
      var result = actionResult.getActionResult()
                   .created(resourceType, response.data.id);
      if (result.result.failed.length === 0 && result.result.created.length > 0) {
        $location.path("/cluster/nodes");
      } else {
        return result.result;
      }
    }
  }
})();