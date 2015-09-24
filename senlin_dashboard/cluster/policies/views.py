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

from django.utils.translation import ugettext_lazy as _

from senlin_dashboard.api import senlin
from senlin_dashboard.cluster.policies.tables import PoliciesTable

from horizon import exceptions
from horizon import tables


class IndexView(tables.DataTableView):
    table_class = PoliciesTable
    template_name = 'cluster/policies/index.html'

    def get_data(self):
        try:
            policies = senlin.policy_list(self.request)
        except Exception:
            policies = []
            exceptions.handle(self.request,
                              _('Unable to retrieve policies.'))
        return policies