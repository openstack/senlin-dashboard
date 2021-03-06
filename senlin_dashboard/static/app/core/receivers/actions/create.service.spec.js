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

  describe('horizon.cluster.receivers.actions.create.service', function() {

    var service, $scope, $q, deferred, senlin;

    var workflow = {
      init: function (actionType, title, submitText, submitIcon, helpUrl) {
        actionType = title = submitText = submitIcon = helpUrl;
        return {then: angular.noop, dummy: actionType};
      }
    };

    var modal = {
      open: function (config) {
        deferred = $q.defer();
        deferred.resolve(config.model);
        return deferred.promise;
      }
    };

    var selected = {id: 1};

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.cluster.receivers'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.framework.widgets.form.ModalFormService', modal);
      $provide.value('horizon.cluster.receivers.actions.workflow', workflow);
    }));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      service = $injector.get('horizon.cluster.receivers.actions.create.service');
      senlin = $injector.get('horizon.app.core.openstack-service-api.senlin');
      deferred = $q.defer();
      deferred.resolve({data: {id: 1}});
      spyOn(senlin, 'createReceiver').and.returnValue(deferred.promise);
      spyOn(workflow, 'init').and.callThrough();
      spyOn(modal, 'open').and.callThrough();
    }));

    it('should check the policy if the user is allowed to create receiver', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should initialize workflow', function() {
      service.perform(selected, $scope);

      expect(workflow.init).toHaveBeenCalled();

      var modalArgs = workflow.init.calls.mostRecent().args;
      expect(modalArgs[0]).toEqual('create');
      expect(modalArgs[1]).toEqual('Create Receiver');
      expect(modalArgs[2]).toEqual('Create');
      expect(modalArgs[3]).toEqual('fa fa-check');

      expect(modal.open).toHaveBeenCalled();
    });
  });
})();
