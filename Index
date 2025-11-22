import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, Circle, Zap, Target, Trophy, Star, TrendingUp, Clock, Brain } from 'lucide-react';

const ProductivityBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ points: 0, level: 1, streak: 0, tasksCompleted: 0 });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
    addBotMessage("👋 Olá! Sou seu parceiro de produtividade com IA! Estou aqui para te ajudar a conquistar seus objetivos.\n\n✨ Comandos principais:\n• 'adicionar [tarefa]' - Nova tarefa\n• 'listar' - Ver todas as tarefas\n• 'priorizar' - Sugestões de prioridade\n• 'resumo' - Resumo do dia\n• 'motivação' - Mensagem motivacional\n• 'foco' - Check-in de foco");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    saveData();
  }, [tasks, stats]);

  const loadData = async () => {
    try {
      const tasksData = await window.storage.get('productivity-tasks');
      const statsData = await window.storage.get('productivity-stats');
      
      if (tasksData) setTasks(JSON.parse(tasksData.value));
      if (statsData) setStats(JSON.parse(statsData.value));
    } catch (error) {
      console.log('Primeira vez usando o bot!');
    }
  };

  const saveData = async () => {
    try {
      await window.storage.set('productivity-tasks', JSON.stringify(tasks));
      await window.storage.set('productivity-stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const addBotMessage = (text, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const callClaudeAPI = async (prompt) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Erro na API:', error);
      return null;
    }
  };

  const addTask = (description) => {
    const newTask = {
      id: Date.now(),
      description,
      priority: 'media',
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    awardPoints(10, '🎯 Nova tarefa adicionada!');
    addBotMessage(`✅ Tarefa adicionada: "${description}"\n\n💡 Use 'priorizar' para eu te ajudar a organizar suas tarefas!`);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        awardPoints(20, '🏆 Tarefa concluída!');
        setStats(s => ({ ...s, tasksCompleted: s.tasksCompleted + 1 }));
        checkAchievements(stats.tasksCompleted + 1);
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const awardPoints = (points, message) => {
    setStats(prev => {
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        addBotMessage(`🎉 LEVEL UP! Você alcançou o nível ${newLevel}!\n\n${getMotivationalMessage(newLevel)}`);
      }
      
      return { ...prev, points: newPoints, level: newLevel };
    });
    
    addBotMessage(`${message} +${points} XP`);
  };

  const checkAchievements = (totalCompleted) => {
    const achievements = [
      { at: 1, msg: '🌟 Primeira vitória! Continue assim!' },
      { at: 5, msg: '🔥 5 tarefas! Você está pegando o ritmo!' },
      { at: 10, msg: '💪 10 tarefas! Você é imparável!' },
      { at: 25, msg: '🚀 25 tarefas! Produtividade máxima!' },
      { at: 50, msg: '👑 50 tarefas! Você é um mestre da produtividade!' }
    ];

    const achievement = achievements.find(a => a.at === totalCompleted);
    if (achievement) {
      addBotMessage(`🏅 CONQUISTA DESBLOQUEADA!\n${achievement.msg}`, 500);
    }
  };

  const getMotivationalMessage = (level) => {
    const messages = [
      "Cada pequeno passo te leva mais perto dos seus objetivos!",
      "Você está construindo momentum. Continue firme!",
      "Sua dedicação está transformando sonhos em realidade!",
      "O sucesso é a soma de pequenos esforços repetidos. Você está no caminho!",
      "Você está provando para si mesmo o quanto é capaz!"
    ];
    return messages[level % messages.length];
  };

  const handlePrioritize = async () => {
    if (tasks.length === 0) {
      addBotMessage("📋 Você não tem tarefas ainda. Adicione algumas para eu te ajudar a priorizar!");
      return;
    }

    setLoading(true);
    addBotMessage("🤔 Analisando suas tarefas e gerando sugestões de priorização...");

    const taskList = tasks.filter(t => !t.completed).map(t => t.description).join('\n');
    const prompt = `Como assistente de produtividade, analise estas tarefas e sugira uma priorização (Alta, Média ou Baixa) para cada uma, com justificativa breve:

${taskList}

Formato da resposta:
[TAREFA]: [PRIORIDADE] - [JUSTIFICATIVA EM UMA LINHA]`;

    const response = await callClaudeAPI(prompt);
    setLoading(false);

    if (response) {
      addBotMessage(`🎯 **Sugestões de Priorização:**\n\n${response}\n\n💡 Comece pelas tarefas de alta prioridade!`);
      awardPoints(15, '🧠 Análise concluída!');
    }
  };

  const handleSummary = async () => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const highPriority = tasks.filter(t => !t.completed && t.priority === 'alta').length;

    setLoading(true);
    addBotMessage("📊 Gerando seu resumo diário...");

    const prompt = `Como coach de produtividade motivacional, crie um resumo inspirador do dia com estes dados:
- ${completed} tarefas concluídas
- ${pending} tarefas pendentes
- ${highPriority} tarefas de alta prioridade
- Nível atual: ${stats.level}
- Total de XP: ${stats.points}

Inclua: celebração das conquistas, motivação para pendências e uma frase inspiradora final. Seja breve e energizante!`;

    const response = await callClaudeAPI(prompt);
    setLoading(false);

    if (response) {
      addBotMessage(`📈 **Seu Resumo do Dia:**\n\n${response}`);
      awardPoints(10, '📊 Reflexão diária!');
    }
  };

  const handleMotivation = async () => {
    setLoading(true);
    addBotMessage("💫 Preparando uma mensagem especial para você...");

    const prompt = `Crie uma mensagem motivacional curta e poderosa para alguém que está trabalhando em suas tarefas. Seja energizante, autêntico e inspirador. Use emojis relevantes. Máximo 3 frases.`;

    const response = await callClaudeAPI(prompt);
    setLoading(false);

    if (response) {
      addBotMessage(`✨ ${response}`);
      awardPoints(5, '💪 Motivação renovada!');
    }
  };

  const handleFocusCheck = async () => {
    setLoading(true);
    addBotMessage("🎯 Fazendo check-in de foco...");

    const prompt = `Como coach de produtividade, faça 2-3 perguntas reflexivas breves para ajudar alguém a checar seu nível de foco e identificar distrações. Seja direto e prático.`;

    const response = await callClaudeAPI(prompt);
    setLoading(false);

    if (response) {
      addBotMessage(`🧘‍♂️ **Check-in de Foco:**\n\n${response}\n\n💡 Responda mentalmente e ajuste sua estratégia!`);
      awardPoints(10, '🎯 Auto-avaliação!');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim().toLowerCase();
    addUserMessage(input);
    setInput('');

    // Comandos simples
    if (userInput.startsWith('adicionar ')) {
      const task = input.slice(10).trim();
      if (task) addTask(task);
      return;
    }

    if (userInput === 'listar') {
      if (tasks.length === 0) {
        addBotMessage("📝 Você não tem tarefas ainda. Use 'adicionar [tarefa]' para começar!");
      } else {
        const taskList = tasks.map((t, i) => 
          `${t.completed ? '✅' : '⭕'} ${t.description} ${t.priority === 'alta' ? '🔴' : t.priority === 'media' ? '🟡' : '🟢'}`
        ).join('\n');
        addBotMessage(`📋 **Suas Tarefas:**\n\n${taskList}`);
      }
      return;
    }

    if (userInput === 'priorizar') {
      handlePrioritize();
      return;
    }

    if (userInput === 'resumo') {
      handleSummary();
      return;
    }

    if (userInput === 'motivação' || userInput === 'motivacao') {
      handleMotivation();
      return;
    }

    if (userInput === 'foco') {
      handleFocusCheck();
      return;
    }

    if (userInput === 'ajuda' || userInput === 'comandos') {
      addBotMessage("🤖 **Comandos Disponíveis:**\n\n• 'adicionar [tarefa]' - Criar nova tarefa\n• 'listar' - Ver todas as tarefas\n• 'priorizar' - IA sugere prioridades\n• 'resumo' - Resumo do seu dia\n• 'motivação' - Mensagem inspiradora\n• 'foco' - Check-in de produtividade\n• 'limpar' - Reset completo");
      return;
    }

    if (userInput === 'limpar') {
      setTasks([]);
      setStats({ points: 0, level: 1, streak: 0, tasksCompleted: 0 });
      addBotMessage("🔄 Dados resetados! Vamos começar de novo com energia renovada!");
      return;
    }

    // IA livre para outras mensagens
    setLoading(true);
    addBotMessage("💭 Pensando...");

    const prompt = `Você é um assistente de produtividade amigável e motivador. Responda de forma breve e útil a esta mensagem: "${input}". Se possível, relacione com produtividade, foco ou motivação.`;

    const response = await callClaudeAPI(prompt);
    setLoading(false);

    if (response) {
      // Remove a última mensagem "Pensando..."
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(response);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta': return 'text-red-500';
      case 'media': return 'text-yellow-500';
      case 'baixa': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Sidebar com Stats */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="text-indigo-600" />
            Parceiro IA
          </h1>
          <p className="text-sm text-gray-500 mt-1">Seu assistente de produtividade</p>
        </div>

        {/* Stats Gamificados */}
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
            <div className="text-2xl font-bold text-blue-900">{tasks.filter(t => !t.completed).length}</div>
            <div className="text-xs text-blue-600">Pendentes</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-900">{stats.tasksCompleted}</div>
            <div className="text-xs text-green-600">Concluídas</div>
          </div>
        </div>

        {/* Tarefas Ativas */}
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl px-6 py-4 ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white shadow-sm border border-gray-100'
              }`}>
                <div className="whitespace-pre-wrap break-words">{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-6 py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite um comando ou converse comigo..."
                disabled={loading}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                Enviar
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              Experimente: "adicionar estudar Python" • "priorizar" • "resumo" • "motivação"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityBot;
