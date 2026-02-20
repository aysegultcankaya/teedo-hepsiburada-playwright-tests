import { Page, expect } from '@playwright/test';

export class SepetSayfasi {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async sepeteGit() {
        console.log("🛒 Sepetim sayfasına gidiliyor...");

        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            this.page.goto('https://checkout.hepsiburada.com/sepetim')
        ]);


        await this.page.waitForTimeout(3000);
    }

    async sepetiTumDetaylarlaDogrula(marka: string, renk: string, beden: string) {
        console.log(`🧐 Sepet doğrulanıyor: ${marka} - ${renk} - ${beden}`);


        if (this.page.isClosed()) {
            throw new Error("Hata: Sepet sayfası doğrulama yapılmadan kapandı!");
        }

        const sepetMetni = await this.page.locator('body').innerText();
        const metinLower = sepetMetni.toLowerCase();


        expect(metinLower, "❌ Marka bulunamadı!").toContain(marka.toLowerCase());
        expect(metinLower, "❌ Renk bulunamadı!").toContain(renk.toLowerCase());
        expect(sepetMetni, "❌ Beden bulunamadı!").toContain(beden);

        console.log(`✅ BAŞARILI: Sepette ${marka}, ${renk} ve ${beden} bilgileri doğrulandı!`);
    }
}