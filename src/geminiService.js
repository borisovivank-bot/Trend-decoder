export async function analyzeClothing(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}
