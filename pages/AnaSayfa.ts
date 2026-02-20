import { Page, Locator } from '@playwright/test';

export class AnaSayfa {
    readonly page: Page;
    readonly aramaKutusu: Locator;
    readonly araButonu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.aramaKutusu = page.locator('input[data-test-id="search-bar-input"]');
        this.araButonu = page.locator('.searchBoxOld-buttonContainer');
    }

    async siteyeGit() {
        await this.page.goto('https://www.hepsiburada.com');

        // ÇEREZ KAPATMA
        try {
            const kabulEt = this.page.getByRole('button', { name: 'Kabul et' });
            // Varsa tıkla, yoksa 3 saniye sonra pes et devam et
            if (await kabulEt.isVisible({ timeout: 3000 })) {
                await kabulEt.click();
                await this.page.waitForTimeout(2000);
            }
        } catch (e) {
            console.log("Çerez geçildi.");
        }
    }

    async urunAra(urunAdi: string) {

        await this.aramaKutusu.first().waitFor({ state: 'visible' });

        await this.aramaKutusu.first().click({ force: true });

        await this.aramaKutusu.first().clear();
        await this.aramaKutusu.first().fill(urunAdi);

        await this.page.waitForTimeout(1000);

        await this.page.keyboard.press('Enter');

        if (await this.araButonu.isVisible()) {
            await this.araButonu.click({ force: true });
        }
    }
}