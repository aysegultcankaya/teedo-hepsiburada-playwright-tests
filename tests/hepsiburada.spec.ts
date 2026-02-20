import { test } from '@playwright/test';
import { AnaSayfa } from '../pages/AnaSayfa';
import { ListelemeSayfasi } from '../pages/ListelemeSayfasi';
import { UrunDetaySayfasi } from '../pages/UrunDetaySayfasi';
import { SepetSayfasi } from '../pages/SepetSayfasi';

test('Hepsiburada Uçtan Uca Test: Adidas 1. Ürün', async ({ page }) => {
    test.setTimeout(120000);

    const anaSayfa = new AnaSayfa(page);
    const listelemeSayfasi = new ListelemeSayfasi(page);

    // 1. GİRİŞ VE ARAMA
    await anaSayfa.siteyeGit();
    await anaSayfa.urunAra('Adidas ayakkabı');

    await listelemeSayfasi.sonucDogrula('adidas');

    // 🌟 YENİ ADIM: FİLTRE UYGULANMADAN ÖNCEKİ SAYIYI AL 🌟
    console.log("🔍 Filtre öncesi toplam ürün sayısı kontrol ediliyor...");
    const ilkUrunSayisi = await listelemeSayfasi.sonucSayisiniAl();

    // 2. FİLTRELEME
    await listelemeSayfasi.filtreleriUygula();

    await listelemeSayfasi.seciliFiltreleriDogrula();


    // 3. İLK ÜRÜNE TIKLAMA VE YENİ SEKME YAKALAMA
    console.log("Yeni sekme yakalanıyor...");
    const [yeniSekme] = await Promise.all([
        page.waitForEvent('popup'),
        listelemeSayfasi.ilkUruneTikla()
    ]);

    const urunDetaySayfasi = new UrunDetaySayfasi(yeniSekme);
    await urunDetaySayfasi.sepeteEkle();

    const sepetSayfasi = new SepetSayfasi(yeniSekme);
    await sepetSayfasi.sepeteGit();

    // Excel tablosundaki değerleri mühürleme vakti!
    await sepetSayfasi.sepetiTumDetaylarlaDogrula('Adidas', 'Beyaz', '42');

    console.log("🏆 Test Başarıyla Tamamlandı!");
    // Tarayıcının hemen kapanıp 'Target closed' hatası vermemesi için:
    await yeniSekme.waitForTimeout(5000);

    console.log("🏆 TEBRİKLER: Tüm senaryo başarıyla tamamlandı!");

});