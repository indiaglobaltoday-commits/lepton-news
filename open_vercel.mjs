import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const profilePath = path.resolve('../news-posting-automation/news_user_data');
    console.log("Opening Playwright Chromium at:", profilePath);
    const browser = await chromium.launchPersistentContext(profilePath, {
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://vercel.com/new');
    console.log("Browser is open! Log in with GitHub and click Import on 'lepton-news'.");
    console.log("Keep this terminal running until you're done, then press Ctrl+C.");
})();
