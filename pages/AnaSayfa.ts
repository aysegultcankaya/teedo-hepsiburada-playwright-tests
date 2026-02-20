import { Page, Locator } from '@playwright/test';

export class AnaSayfa {
    readonly page: Page;
    readonly aramaKutusu: Locator;
    readonly araButonu: Locator;

    constructor(page: Page) {
        this.page = page;
        // Senin en başta bulduğun ve çalışan ID
        this.aramaKutusu = page.locator('input[data-test-id="search-bar-input"]');
        // Büyüteç butonu
        this.araButonu = page.locator('.searchBoxOld-buttonContainer');
    }

    async siteyeGit() {
        await this.page.goto('https://www.hepsiburada.com');

        // ÇEREZ KAPATMA (Basit ve Hızlı Yöntem)
        try {
            const kabulEt = this.page.getByRole('button', { name: 'Kabul et' });
            // Varsa tıkla, yoksa 3 saniye sonra pes et devam et
            if (await kabulEt.isVisible({ timeout: 3000 })) {
                await kabulEt.click();
                await this.page.waitForTimeout(2000); // Tıklayınca sayfa titrer, bekle
            }
        } catch (e) {
            console.log("Çerez geçildi.");
        }
    }

    async urunAra(urunAdi: string) {
        // Arama kutusuna odaklan
        // Elementi bulamazsa 30 saniye bekler (Default süre)
        await this.aramaKutusu.first().waitFor({ state: 'visible' });

        // Zorla tıkla (Önünde bir şey olsa bile tıklar)
        await this.aramaKutusu.first().click({ force: true });

        // Temizle ve Yaz
        await this.aramaKutusu.first().clear();
        await this.aramaKutusu.first().fill(urunAdi);

        // İnsan gibi bekle (Çok hızlı yazınca site algılamıyor)
        await this.page.waitForTimeout(1000);

        // Hem Enter'a bas Hem Butona Tıkla (Garanti Yöntem)
        await this.page.keyboard.press('Enter');

        if (await this.araButonu.isVisible()) {
            await this.araButonu.click({ force: true });
        }
    }
}