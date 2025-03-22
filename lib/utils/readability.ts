import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import * as playwright from 'playwright';

/**
 * 使用静态JSDOM从URL提取网页内容
 */
export async function extractContentWithJSDOM(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    
    if (!article || !article.textContent) {
      throw new Error('无法提取文章内容');
    }
    
    return article.textContent;
  } catch (error) {
    console.error('JSDOM提取失败，尝试使用Playwright:', error);
    return extractContentWithPlaywright(url);
  }
}

/**
 * 使用Playwright从URL提取网页内容（处理动态渲染的网页）
 */
export async function extractContentWithPlaywright(url: string): Promise<string> {
  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('页面网络活动未完全停止，但继续处理');
    });
    
    // 获取页面HTML
    const html = await page.content();
    
    // 使用Readability解析
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    
    if (!article || !article.textContent) {
      throw new Error('无法提取文章内容');
    }
    
    return article.textContent;
  } catch (error) {
    console.error('Playwright提取失败:', error);
    throw new Error(`无法从URL提取内容: ${error}`);
  } finally {
    await browser.close();
  }
}

/**
 * 从URL提取网页内容的主函数，先尝试JSDOM，失败后使用Playwright
 */
export async function extractContent(url: string): Promise<string> {
  try {
    return await extractContentWithJSDOM(url);
  } catch (error) {
    console.error('提取内容失败:', error);
    throw error;
  }
} 