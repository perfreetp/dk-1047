import { Filter } from 'lucide-react';
import { stores } from '../../data/mockData';
import { useDeviceStore } from '../../contexts/deviceStore';

export default function DeviceFilter() {
  const { filters, setFilters } = useDeviceStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">筛选条件</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            门店
          </label>
          <select
            value={filters.storeId}
            onChange={(e) => setFilters({ storeId: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部门店</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            在线状态
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="busy">忙碌</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            备注搜索
          </label>
          <input
            type="text"
            value={filters.searchKeyword}
            onChange={(e) => setFilters({ searchKeyword: e.target.value })}
            placeholder="输入关键词搜索..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {(filters.storeId || filters.status || filters.searchKeyword) && (
        <button
          onClick={() => setFilters({ storeId: '', status: '', searchKeyword: '' })}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          清除所有筛选条件
        </button>
      )}
    </div>
  );
}
