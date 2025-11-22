import React, { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { loadData, saveData } from './utils/storage';
import { handleCommand } from './utils/commandHandler';
import { callClaudeAPI } from './services/claudeAPI';

const ProductivityBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ points: 0, level: 1, streak: 0, tasksCompleted: 0 });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeBot();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    saveData(tasks, stats);
  }, [tasks, stats]);

  const initializeBot = async () => {
    const { tasks: loadedTasks, stats: loadedStats } = await loadData();
    if (loadedTasks) setTasks(loadedTasks);
    if (loadedStats) setStats(loadedStats);
    
    addBotMessage("👋 Olá! Sou seu parceiro de produtividade com IA! Estou aqui para te ajudar a conquistar seus objetivos.\n\n✨ Comandos principais:\n• 'adicionar [tarefa]' - Nova tarefa\n• 'listar' - Ver todas as tarefas\n• 'priorizar' - Sugestões de prioridade\n• 'resumo' - Resumo do dia\n• 'motivação' - Mensagem motivacional\n• 'foco' - Check-in de foco");
  };

  const addBotMessage = (text, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    addUserMessage(input);
    const userInput = input.trim();
    setInput('');
    setLoading(true);

    await handleCommand({
      input: userInput,
      tasks,
      setTasks,
      stats,
      setStats,
      addBotMessage,
      setMessages,
      callClaudeAPI,
      setLoading
    });

    setLoading(false);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        const newStats = { ...stats, tasksCompleted: stats.tasksCompleted + 1 };
        setStats(newStats);
        addBotMessage('🏆 Tarefa concluída! +20 XP');
        checkLevelUp(stats.points + 20);
        checkAchievements(newStats.tasksCompleted);
        setStats(s => ({ ...s, points: s.points + 20 }));
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const checkLevelUp = (newPoints) => {
    const newLevel = Math.floor(newPoints / 100) + 1;
    if (newLevel > stats.level) {
      addBotMessage(`🎉 LEVEL UP! Você alcançou o nível ${newLevel}!`, 500);
      setStats(s => ({ ...s, level: newLevel }));
    }
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

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      <Sidebar 
        stats={stats} 
        tasks={tasks} 
        toggleTask={toggleTask}
      />
      <ChatArea 
        messages={messages}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};