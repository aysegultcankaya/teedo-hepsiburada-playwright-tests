import { Page, expect } from '@playwright/test';

export class SepetSayfasi {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async sepeteGit() {
        console.log("🛒 Sepetim sayfasına gidiliyor...");

        // Target page closed hatasını önlemek için navigation ve yüklemeyi daha güvenli yapıyoruz
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'), // DOM'un gelmesi yeterli
            this.page.goto('https://checkout.hepsiburada.com/sepetim')
        ]);

        // networkidle bazen çok uzun sürer ve timeout'a (image_e01b70.jpg) sebep olur.
        // Bunun yerine sepetin boş olmadığını gösteren bir elementin gelmesini beklemek daha sağlıklıdır.
        await this.page.waitForTimeout(3000);
    }

    async sepetiTumDetaylarlaDogrula(marka: string, renk: string, beden: string) {
        console.log(`🧐 Sepet doğrulanıyor: ${marka} - ${renk} - ${beden}`);

        // Sayfa kapandıysa metin okuyamaz, bu yüzden önce sayfanın hala açık olduğunu kontrol et
        if (this.page.isClosed()) {
            throw new Error("Hata: Sepet sayfası doğrulama yapılmadan kapandı!");
        }

        const sepetMetni = await this.page.locator('body').innerText();
        const metinLower = sepetMetni.toLowerCase();

        // Excel TS_HB_MOB_004 gereksinimleri:
        expect(metinLower, "❌ Marka bulunamadı!").toContain(marka.toLowerCase());
        expect(metinLower, "❌ Renk bulunamadı!").toContain(renk.toLowerCase());
        expect(sepetMetni, "❌ Beden bulunamadı!").toContain(beden);

        console.log(`✅ BAŞARILI: Sepette ${marka}, ${renk} ve ${beden} bilgileri doğrulandı!`);
    }
}