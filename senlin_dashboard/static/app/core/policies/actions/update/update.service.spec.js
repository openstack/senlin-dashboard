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

  describe('horizon.cluster.policies.actions.update.service', function() {

    var service, $scope, $q, deferred, senlin;

    var workflow = {
      init: function (actionType, title, submitText) {
        actionType = title = submitText;
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
    beforeEach(module('horizon.cluster.policies'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.cluster.policies.actions.workflow', workflow);
      $provide.value('horizon.framework.widgets.form.ModalFormService', modal);
    }));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      service = $injector.get('horizon.cluster.policies.actions.update.service');
      senlin = $injector.get('horizon.app.core.openstack-service-api.senlin');
      deferred = $q.defer();
      deferred.resolve({data: {id: 1}});
      spyOn(senlin, 'updatePolicy').and.returnValue(deferred.promise);
      spyOn(workflow, 'init').and.callThrough();
      spyOn(modal, 'open').and.callThrough();
    }));

    it('should check the policy if the user is allowed to update policy', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should initialize workflow', function() {
      service.perform(selected, $scope);

      expect(workflow.init).toHaveBeenCalled();

      var modalArgs = workflow.init.calls.mostRecent().args;
      expect(modalArgs[0]).toEqual('update');
      expect(modalArgs[1]).toEqual('Update Policy');
      expect(modalArgs[2]).toEqual('Update');

      expect(modal.open).toHaveBeenCalled();
    });
  });
})();