const handleCommand = async (context) => {
  const { input, tasks, setTasks, stats, setStats, addBotMessage, setMessages, callClaudeAPI, setLoading } = context;
  const userInput = input.toLowerCase();

  // Adicionar tarefa
  if (userInput.startsWith('adicionar ')) {
    const task = input.slice(10).trim();
    if (task) {
      const newTask = {
        id: Date.now(),
        description: task,
        priority: 'media',
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
      setStats(s => ({ ...s, points: s.points + 10 }));
      addBotMessage(`✅ Tarefa adicionada: "${task}"\n\n💡 Use 'priorizar' para eu te ajudar a organizar suas tarefas!\n\n🎯 +10 XP`);
    }
    setLoading(false);
    return;
  }

  // Listar tarefas
  if (userInput === 'listar') {
    if (tasks.length === 0) {
      addBotMessage("📝 Você não tem tarefas ainda. Use 'adicionar [tarefa]' para começar!");
    } else {
      const taskList = tasks.map(t => 
        `${t.completed ? '✅' : '⭕'} ${t.description}`
      ).join('\n');
      addBotMessage(`📋 **Suas Tarefas:**\n\n${taskList}`);
    }
    setLoading(false);
    return;
  }

  // Priorizar
  if (userInput === 'priorizar') {
    if (tasks.filter(t => !t.completed).length === 0) {
      addBotMessage("📋 Você não tem tarefas pendentes para priorizar!");
      setLoading(false);
      return;
    }

    addBotMessage("🤔 Analisando suas tarefas e gerando sugestões de priorização...");
    const taskList = tasks.filter(t => !t.completed).map(t => t.description).join('\n');
    const prompt = `Como assistente de produtividade, analise estas tarefas e sugira uma priorização (Alta, Média ou Baixa) para cada uma, com justificativa breve:\n\n${taskList}\n\nFormato: [TAREFA]: [PRIORIDADE] - [JUSTIFICATIVA]`;
    
    const response = await callClaudeAPI(prompt);
    if (response) {
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(`🎯 **Sugestões de Priorização:**\n\n${response}\n\n💡 Comece pelas tarefas de alta prioridade!\n\n🧠 +15 XP`);
      setStats(s => ({ ...s, points: s.points + 15 }));
    }
    setLoading(false);
    return;
  }

  // Resumo
  if (userInput === 'resumo') {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    
    addBotMessage("📊 Gerando seu resumo diário...");
    const prompt = `Como coach de produtividade motivacional, crie um resumo inspirador do dia com estes dados:\n- ${completed} tarefas concluídas\n- ${pending} tarefas pendentes\n- Nível atual: ${stats.level}\n- Total de XP: ${stats.points}\n\nInclua: celebração das conquistas, motivação para pendências e uma frase inspiradora final. Seja breve e energizante!`;
    
    const response = await callClaudeAPI(prompt);
    if (response) {
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(`📈 **Seu Resumo do Dia:**\n\n${response}\n\n📊 +10 XP`);
      setStats(s => ({ ...s, points: s.points + 10 }));
    }
    setLoading(false);
    return;
  }

  // Motivação
  if (userInput === 'motivação' || userInput === 'motivacao') {
    addBotMessage("💫 Preparando uma mensagem especial para você...");
    const prompt = `Crie uma mensagem motivacional curta e poderosa para alguém que está trabalhando em suas tarefas. Seja energizante, autêntico e inspirador. Use emojis relevantes. Máximo 3 frases.`;
    
    const response = await callClaudeAPI(prompt);
    if (response) {
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(`✨ ${response}\n\n💪 +5 XP`);
      setStats(s => ({ ...s, points: s.points + 5 }));
    }
    setLoading(false);
    return;
  }

  // Foco
  if (userInput === 'foco') {
    addBotMessage("🎯 Fazendo check-in de foco...");
    const prompt = `Como coach de produtividade, faça 2-3 perguntas reflexivas breves para ajudar alguém a checar seu nível de foco e identificar distrações. Seja direto e prático.`;
    
    const response = await callClaudeAPI(prompt);
    if (response) {
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(`🧘‍♂️ **Check-in de Foco:**\n\n${response}\n\n💡 Responda mentalmente e ajuste sua estratégia!\n\n🎯 +10 XP`);
      setStats(s => ({ ...s, points: s.points + 10 }));
    }
    setLoading(false);
    return;
  }

  // Ajuda
  if (userInput === 'ajuda' || userInput === 'comandos') {
    addBotMessage("🤖 **Comandos Disponíveis:**\n\n• 'adicionar [tarefa]' - Criar nova tarefa\n• 'listar' - Ver todas as tarefas\n• 'priorizar' - IA sugere prioridades\n• 'resumo' - Resumo do seu dia\n• 'motivação' - Mensagem inspiradora\n• 'foco' - Check-in de produtividade\n• 'limpar' - Reset completo");
    setLoading(false);
    return;
  }

  // Limpar
  if (userInput === 'limpar') {
    setTasks([]);
    setStats({ points: 0, level: 1, streak: 0, tasksCompleted: 0 });
    addBotMessage("🔄 Dados resetados! Vamos começar de novo com energia renovada!");
    setLoading(false);
    return;
  }

  // IA livre
  addBotMessage("💭 Pensando...");
  const prompt = `Você é um assistente de produtividade amigável e motivador. Responda de forma breve e útil a esta mensagem: "${input}". Se possível, relacione com produtividade, foco ou motivação.`;
  
  const response = await callClaudeAPI(prompt);
  if (response) {
    setMessages(prev => prev.slice(0, -1));
    addBotMessage(response);
  }
  setLoading(false);
};

export default ProductivityBot;