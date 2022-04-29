# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.conf import settings
from django.urls import re_path
from django.utils.translation import ugettext_lazy as _

from horizon.browsers.views import AngularIndexView

from senlin_dashboard.cluster.clusters import views as legacyViews


if settings.ANGULAR_FEATURES.get('clusters_panel', True):
    title = _("Clusters")
    urlpatterns = [
        re_path('', AngularIndexView.as_view(title=title), name='index'),
    ]
else:
    urlpatterns = [
        re_path(r'^$', legacyViews.IndexView.as_view(), name='index'),
        re_path(r'^create/$', legacyViews.CreateView.as_view(),
                name='create'),
        re_path(r'^(?P<cluster_id>[^/]+)/$',
                legacyViews.DetailView.as_view(), name='detail'),
        re_path(r'^(?P<cluster_id>[^/]+)/manage_policies/$',
                legacyViews.ManagePoliciesView.as_view(),
                name='manage_policies'),
    ]
