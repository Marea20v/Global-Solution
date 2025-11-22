const loadData = async () => {
  try {
    const tasksData = await window.storage.get('productivity-tasks');
    const statsData = await window.storage.get('productivity-stats');
    
    return {
      tasks: tasksData ? JSON.parse(tasksData.value) : null,
      stats: statsData ? JSON.parse(statsData.value) : null
    };
  } catch (error) {
    console.log('Primeira vez usando o bot!');
    return { tasks: null, stats: null };
  }
};

const saveData = async (tasks, stats) => {
  try {
    await window.storage.set('productivity-tasks', JSON.stringify(tasks));
    await window.storage.set('productivity-stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Erro ao salvar:', error);
  }
};
