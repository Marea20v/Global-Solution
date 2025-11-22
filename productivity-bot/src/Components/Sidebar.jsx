const Sidebar = ({ stats, tasks, toggleTask }) => {
  const { Trophy, Target, CheckCircle2, Zap, Circle } = require('lucide-react');
  
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Brain className="text-indigo-600" />
          Parceiro IA
        </h1>
        <p className="text-sm text-gray-500 mt-1">Seu assistente de produtividade</p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90">Nível</div>
            <div className="text-4xl font-bold">{stats.level}</div>
          </div>
          <Trophy className="w-12 h-12 opacity-80" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP: {stats.points}</span>
            <span>{stats.level * 100} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(stats.points % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <Target className="w-6 h-6 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-xs text-blue-600">Pendentes</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-green-900">{stats.tasksCompleted}</div>
          <div className="text-xs text-green-600">Concluídas</div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Tarefas Ativas
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {tasks.filter(t => !t.completed).length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              Nenhuma tarefa pendente!
            </div>
          ) : (
            tasks.filter(t => !t.completed).map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <Circle className="w-5 h-5 text-gray-400 group-hover:text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 break-words">{task.description}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};