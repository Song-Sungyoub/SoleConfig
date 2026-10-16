// Run: node check-mockup.cjs (Playwright installed, or NODE_PATH pointing to its package directory).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
 const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'UI-MOCKUP.html')).href);
 await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('14px Pretendard')));
 assert.equal(await page.locator('tr[data-id]').count(),14);
 const out=path.join(__dirname,'..','.tmp','soleconfig-mockup');fs.mkdirSync(out,{recursive:true});
 await page.screenshot({path:path.join(out,'main.png'),fullPage:true});
 await page.locator('[data-menu]').first().click();
 assert(await page.locator('[data-action="encrypt"]').isDisabled());
 await page.keyboard.press('Escape');
 const port=page.locator('tr[data-id]').filter({has:page.locator('.label',{hasText:/^port$/})});
 await port.locator('[data-value]').dblclick();
 await page.locator('#editvalue').fill('99999');await page.locator('#editform button[type=submit]').click();
 assert((await page.locator('#editerror').textContent()).includes('65535'));
 await page.locator('#editvalue').fill('9090');await page.locator('#editform button[type=submit]').click();
 assert((await page.locator('#dirty').textContent()).includes('1개'));
 await page.locator('#undo').click();assert((await port.locator('[data-value]').textContent()).includes('8080'));
 const key=page.locator('tr[data-id]').filter({has:page.locator('.label',{hasText:/^apiKey$/})});
 await key.locator('[data-menu]').click();await page.screenshot({path:path.join(out,'menu.png'),fullPage:true});
 await page.locator('[data-action=hash]').click();await page.locator('#transforminput').fill('abc');await page.locator('#calculate').click();
 await page.waitForFunction(()=>document.querySelector('#result').value.length===64);
 assert.equal(await page.locator('#result').inputValue(),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 await page.screenshot({path:path.join(out,'hash.png'),fullPage:true});
 await page.locator('[data-close=transform]').click();
 await key.locator('[data-menu]').click();await page.locator('[data-action=encrypt]').click();await page.locator('#key').fill('demo');await page.locator('#calculate').click();
 assert((await page.locator('#result').inputValue()).startsWith('DEMO:'));
 await page.locator('#applyresult').click();
 await key.locator('[data-menu]').click();await page.locator('[data-action=decrypt]').click();await page.locator('#key').fill('demo');await page.locator('#calculate').click();
 assert.equal(await page.locator('#result').inputValue(),'sample-key-2026');
 await page.locator('[data-close=transform]').click();
 for (const format of ['XML','CSV','YAML','INI','JSON']){
   await page.locator(`[data-format=${format}]`).click();
   assert((await page.locator('#statusformat').textContent())===format);
   await page.locator('#sourceview').click();assert((await page.locator('.source').textContent()).length>20);
   await page.locator('#gridview').click();
 }
 await page.locator('#search').fill('Receiver-A');assert(await page.locator('tbody tr').count()>0);await page.locator('#search').fill('not-found-xyz');assert(await page.locator('.empty-state').isVisible());await page.locator('#search').fill('');
 await page.locator('#collapse').click();assert.equal(await page.locator('tbody tr').count(),4);
 await page.locator('#expand').click();assert.equal(await page.locator('tbody tr').count(),19);
 await page.locator('[data-format=INI]').click();
 await page.locator('button[data-theme=dark]').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 assert(await page.evaluate(()=>getComputedStyle(document.querySelector('tbody td')).backgroundColor!==getComputedStyle(document.querySelector('tbody td:nth-child(2)')).backgroundColor));
 await page.screenshot({path:path.join(out,'dark.png'),fullPage:true});
 await page.locator('tr[data-id]').filter({has:page.locator('.label',{hasText:/^token$/})}).locator('[data-menu]').click();
 await page.locator('[data-action=hash]').click();
 await page.screenshot({path:path.join(out,'dark-dialog.png'),fullPage:true});
 await page.locator('[data-close=transform]').click();
 await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('button[data-theme=light]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await page.locator('[data-format=INI]').click();
 await page.screenshot({path:path.join(out,'light-columns.png'),fullPage:true});
 await page.setViewportSize({width:800,height:750});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(out,'narrow.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: fonts, grid, menus, validation, undo, SHA-256, demo conversion, five formats, search, expand/collapse, responsive layout; no browser errors.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
