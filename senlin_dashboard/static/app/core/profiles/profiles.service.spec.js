/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  "use strict";

  describe('profile service', function() {
    var service, $scope;
    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.cluster'));

    beforeEach(inject(function($injector, _$rootScope_) {
      service = $injector.get('horizon.cluster.profiles.service');
      $scope = _$rootScope_.$new();
    }));

    it("getDetailsPath creates urls using the item's ID", function() {
      var myItem = {id: "666"};
      expect(service.getDetailsPath(myItem)).toBe('project/ngdetails/OS::Senlin::Profile/666');
    });

    describe('getProfilePromise', function() {
      it("get profile promise", inject(function($q, $injector) {
        var senlin = $injector.get('horizon.app.core.openstack-service-api.senlin');
        var deferred = $q.defer();
        spyOn(senlin, 'getProfile').and.returnValue(deferred.promise);
        var result = service.getProfilePromise({});
        deferred.resolve({id: 1, name: 'test-profile'});
        $scope.$apply();
        expect(result.$$state.value.id).toBe(1);
      }));
    });

    describe('getProfilesPromise', function() {
      it("get profiles promise", inject(function($q, $injector) {
        var senlin = $injector.get('horizon.app.core.openstack-service-api.senlin');
        var deferred = $q.defer();
        spyOn(senlin, 'getProfiles').and.returnValue(deferred.promise);
        var result = service.getProfilesPromise({});
        deferred.resolve({data: {items: [{id: 1, name: 'test-profile'}]}});
        $scope.$apply();
        expect(result.$$state.value.data.items[0].name).toBe('test-profile');
      }));
    });
  });

})();
