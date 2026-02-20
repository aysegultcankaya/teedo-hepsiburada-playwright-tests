import { expect, Page, Locator } from '@playwright/test';

export class UrunDetaySayfasi {
    readonly page: Page;
    readonly sepeteEkleButonu: Locator;

    constructor(page: Page) {
        this.page = page;

        this.sepeteEkleButonu = page.locator('#addToCart, button:has-text("Sepete ekle"), [data-test-id="addToCart"]').first();
    }

    async sepeteEkle() {
        console.log("🛒 Ürün detay sayfasında işlem yapılıyor...");

        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(3000);

        await this.sepeteEkleButonu.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.sepeteEkleButonu).toBeVisible();

        await this.sepeteEkleButonu.click({ force: true });
        console.log("✅ 'Sepete Ekle' butonuna başarıyla tıklandı.");

        await this.page.waitForTimeout(3000);
    }
}