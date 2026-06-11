import { Filter } from 'lucide-react';
import { problemTags } from '../../data/mockData';
import { useSessionStore } from '../../contexts/sessionStore';

export default function SessionFilter() {
  const { filters, setFilters } = useSessionStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">筛选会话</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            开始日期
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ startDate: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            结束日期
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ endDate: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            操作者
          </label>
          <input
            type="text"
            value={filters.operator}
            onChange={(e) => setFilters({ operator: e.target.value })}
            placeholder="搜索操作者..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            问题标签
          </label>
          <div className="flex flex-wrap gap-1">
            {problemTags.map((tag) => {
              const isSelected = filters.tags.includes(tag.label);
              return (
                <button
                  key={tag.label}
                  onClick={() => {
                    if (isSelected) {
                      setFilters({ tags: filters.tags.filter(t => t !== tag.label) });
                    } else {
                      setFilters({ tags: [...filters.tags, tag.label] });
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {(filters.startDate || filters.endDate || filters.operator || filters.tags.length > 0) && (
        <button
          onClick={() => setFilters({ startDate: '', endDate: '', operator: '', tags: [] })}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          清除所有筛选条件
        </button>
      )}
    </div>
  );
}
