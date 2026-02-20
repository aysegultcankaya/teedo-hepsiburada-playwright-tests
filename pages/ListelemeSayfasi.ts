import { expect, Locator, Page } from '@playwright/test';

export class ListelemeSayfasi {
    readonly page: Page;
    readonly urunBasliklari: Locator;

    constructor(page: Page) {
        this.page = page;
        this.urunBasliklari = this.page.locator('li[id^="i"] a[class*="titleText"]');
    }

    async sonucDogrula(arananKelime: string) {
        console.log(`🔎 Ekranda "${arananKelime}" doğrulaması yapılıyor...`);

        // Önce elementin sayfada belirmesini (visible) bekle (Hemen aramaya kalkıp timeout olmasın)
        await this.urunBasliklari.first().waitFor({ state: 'visible', timeout: 15000 });

        // İlk ürünün metnini alıp içinde "adidas" yazıyor mu diye doğrula
        await expect(this.urunBasliklari.first()).toContainText(new RegExp(arananKelime, 'i'));

        console.log("✅ Adidas doğrulaması başarılı!");
    }
    async filtreleriUygula() {
        console.log("🚀 Akıllı Filtreleme: Direkt URL'e gidiliyor...");
        // Filtrelerin uygulanmış olduğu direkt URL
        const hedefURL = 'https://www.hepsiburada.com/ara?q=adidas%20ayakkab%C4%B1&filtreler=bedenler:42;cinsiyet:Erkek;fiyat:3000-5000;renk:Beyaz';

        await this.page.goto(hedefURL);
        await this.page.waitForLoadState('domcontentloaded');

        // Çerez çıkarsa kapat
        try {
            const cerez = this.page.getByRole('button', { name: 'Kabul et' });
            if (await cerez.isVisible({ timeout: 5000 })) {
                await cerez.click();
            }
        } catch (e) { }
        console.log("✅ Filtrelenmiş sayfa hazır.");
    }
    async seciliFiltreleriDogrula() {
        console.log("🔍 Filtreler kontrol ediliyor...");

        // TAKTİK: Direkt scroll yapmak yerine, elementin sayfaya tam "yapışmasını" bekliyoruz.
        // Hepsiburada'nın zıplayan menüsünü bu yöntemle ehlileştiriyoruz.

        const filtreler = [
            { name: /42/i, label: 'Beden' },
            { name: /Erkek/i, label: 'Cinsiyet' },
            { name: /Beyaz/i, label: 'Renk' }, // image_e00529'da burada patlıyordu!
            { name: /3000 - 5000/i, label: 'Fiyat' }
        ];

        for (const filtre of filtreler) {
            const locator = this.page.getByRole('button', { name: filtre.name }).first();

            // Elementin DOM'a bağlanmasını ve kararlı hale gelmesini bekle
            await locator.waitFor({ state: 'attached', timeout: 15000 });

            // scrollIntoViewIfNeeded() bazen çok agresif olabilir. 
            // Direkt expect kullanmak, Playwright'ın arkada otomatik deneme yapmasını sağlar.
            await expect(locator).toBeVisible();
            console.log(`✅ ${filtre.label} filtresi doğrulandı.`);
        }
    }

    async sonucSayisiniAl(): Promise<number> {
        await this.page.waitForTimeout(2000);

        const ozetAlani = this.page.locator('[data-test-id="header-h1"]');
        await ozetAlani.waitFor({ state: 'visible', timeout: 15000 });

        const metin = await ozetAlani.innerText();

        // 🚀 DÜZELTME BURADA: Regex içine \+ ekledik ki "10.000+" gibi sayıları da tanısın!
        const eslesme = metin.match(/\(([\d,.\+]+)\s*ürün\)/i);

        if (eslesme && eslesme[1]) {
            // "10.000+" stringinden nokta, virgül ve + işaretini temizler, sadece "10000" rakamını bırakır.
            const temizSayi = parseInt(eslesme[1].replace(/[^0-9]/g, ''), 10);
            console.log(`📊 Ekranda okunan ürün sayısı: ${temizSayi}`);
            return temizSayi;
        }

        throw new Error(`Ürün sayısı metin içinde bulunamadı! Okunan Metin: ${metin}`);
    }
    async ilkUruneTikla() {
        console.log("🖱️ Listenin ilk ürününe tıklanıyor...");
        await this.page.waitForTimeout(2000);
        // Sayfadaki ilk ürün kartını bulur
        const ilkUrun = this.page.locator('li[id^="i"] a').first();
        await ilkUrun.waitFor({ state: 'visible', timeout: 15000 });
        // Yeni sekme tetiklemesi için tıklar
        await ilkUrun.click({ force: true });
    }
}