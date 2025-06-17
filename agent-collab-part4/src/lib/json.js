export function extractJSONString(text = '') {
    
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

  const markdownJsonPattern = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = text.match(markdownJsonPattern);
  const jsonStr = match ? match[1].trim() : text.trim();

  
  try {
    const jsonObj = JSON.parse(jsonStr);
    // const minifiedJSON = jsonToStrEscape(jsonObj);
    return jsonObj;
  } catch (error) {
    return null;
  }
}


export const jsonToStrEscape = (jsonObj) => {
  return escapeQuot(JSON.stringify(jsonObj));
};

export const escapeQuot = (str) => {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};