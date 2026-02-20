import { expect, Page, Locator } from '@playwright/test';

export class UrunDetaySayfasi {
    readonly page: Page;
    readonly sepeteEkleButonu: Locator;

    constructor(page: Page) {
        this.page = page;
        // Farklı buton varyasyonlarını yakalayan efsanevi strateji
        this.sepeteEkleButonu = page.locator('#addToCart, button:has-text("Sepete ekle"), [data-test-id="addToCart"]').first();
    }

    async sepeteEkle() {
        console.log("🛒 Ürün detay sayfasında işlem yapılıyor...");

        // Sayfanın DOM ağacının ve görsel elementlerin tamamen oturmasını bekle
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(3000);

        // 🌟 DOĞRULAMA (Excel TS_HB_MOB_003 Adımı): Buton ekranda görünür mü?
        await this.sepeteEkleButonu.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.sepeteEkleButonu).toBeVisible();

        // Zorunlu Tıklama (force: true) -> Önüne başka element çıksa bile tıklamayı başarır
        await this.sepeteEkleButonu.click({ force: true });
        console.log("✅ 'Sepete Ekle' butonuna başarıyla tıklandı.");

        // Ürün sepete eklendikten sonra çıkan animasyon/bildirim için bekleme
        await this.page.waitForTimeout(3000);
    }
}