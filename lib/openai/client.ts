import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

export const openai = new OpenAI({
  apiKey,
});

export async function extractCocktailData(content: string, sourceUrl: string): Promise<any> {
  try {
    const prompt = `
    从以下鸡尾酒配方网页内容中提取结构化信息，返回JSON格式：
    - 鸡尾酒名称（name）
    - 配料及份量（ingredients，包含name、amount、unit三个字段）
    - 制作步骤（steps，数组格式）
    - 适合的系统标签（tags，数组格式，如"经典鸡尾酒"、"夏日清爽"等）
    
    网页内容:
    ${content}
    
    源网页链接：${sourceUrl}
    
    请返回有效的JSON格式，不要包含任何其他文本。JSON结构应该是:
    {
      "name": "鸡尾酒名称",
      "ingredients": [
        {
          "name": "配料名称",
          "amount": "份量数值",
          "unit": "单位"
        },
        ...
      ],
      "steps": ["步骤1", "步骤2", ...],
      "tags": ["标签1", "标签2", ...]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的鸡尾酒配方提取助手，能够从网页内容中提取结构化的鸡尾酒配方信息。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error('OpenAI API返回空内容');
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      ...result,
      source_url: sourceUrl
    };
  } catch (error) {
    console.error('提取鸡尾酒数据失败:', error);
    throw error;
  }
} 