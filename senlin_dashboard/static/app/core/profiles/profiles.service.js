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

  angular
    .module('horizon.cluster.profiles')
    .factory('horizon.cluster.profiles.service', profileService);

  profileService.$inject = [
    'horizon.app.core.openstack-service-api.senlin'
  ];

  /*
   * @ngdoc factory
   * @name horizon.cluster.profiles.service
   *
   * @description
   * This service provides functions that are used through
   * the Profiles features.
   */
  function profileService(senlin) {
    return {
      getDetailsPath: getDetailsPath,
      getProfilePromise: getProfilePromise,
      getProfilesPromise: getProfilesPromise
    };

    /*
     * @ngdoc function
     * @name getDetailsPath
     * @param item {Object} - The profile object
     * @description
     * Returns the relative path to the details view.
     */
    function getDetailsPath(item) {
      return 'project/ngdetails/OS::Senlin::Profile/' + item.id;
    }

    /*
     * @ngdoc function
     * @name getProfilePromise
     * @description
     * Given an id, returns a promise for the profile data.
     */
    function getProfilePromise(identifier) {
      return senlin.getProfile(identifier);
    }

    /*
     * @ngdoc function
     * @name getProfilesPromise
     * @description
     * Given filter/query parameters, returns a promise for the matching
     * profiles.  This is used in displaying lists of Profiles.  In this case,
     * we need to modify the API's response by adding a composite value called
     * 'trackBy' to assist the display mechanism when updating rows.
     */
    function getProfilesPromise(params) {
      return senlin.getProfiles(params).then(modifyResponse);

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(addTrackBy)}};

        function addTrackBy(profile) {
          profile.trackBy = profile.id;
          return profile;
        }
      }
    }
  }
})();