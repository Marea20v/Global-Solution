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