# Military Symbol Studio yeniden tasarımı

Tarih: 2026-11-02
Durum: taslak, kullanıcı onayı bekliyor
Görsel referans: "Symbol Studio redesign" tasarım tuvali, öneri 3 (4 pano)

## 1. Amaç

Studio'nun arayüzünü öneri 3'teki düzene taşımak. İki kural var:

1. **Hiçbir mevcut özellik kaybolmaz.** Bölüm 4'teki tablo, bugünkü her özelliğin yeni yerini gösterir. Uygulama bitince bu tablo madde madde kontrol edilir.
2. **Referans sitedeki (spatialillusions.com/unitgenerator) eksik özellikler eklenir**, kütüphanenin desteklediği ve sembol çizimiyle ilgili oldukları sürece (bölüm 5). Kapsam dışı kalanlar gerekçesiyle bölüm 8'de.

Hedef kullanıcılar:

- **Normal kullanıcı:** sembolü isimle bulur, şekle bakarak seçer, birkaç etiket yazar, indirir.
- **Senior kullanıcı / geliştirici:** SIDC yapıştırır, kodu okur, alan kodlarıyla ve sınırlarla çalışır, her sürümün kurallarını bilir.

## 2. Kısıtlar

- Studio düz statik HTML/JS kalır. Framework ya da bağımlılık eklenmez.
- Kütüphane (`src/`) değişmez. Studio, `dist/milsymbol.development.js` paketini kullanmaya devam eder.
- Yeni bir `studio/*.js` dosyası eklenirse `scripts/build-studio.mjs` içinde iki yere yazılır: kopyalama listesi ve public build izin listesi. Yoksa `studio:build:public` reddeder.
- Çevrim dışı çalışma, yerel bayrak çizimleri ve lisans dosyaları aynen korunur.
- APP-6A kuralları (`src/lettersidc/metadata.js`, Table III sınırları, S-scheme zorunluluğu) Studio'da yeniden yazılmaz. Bugünkü gibi `vendor/letter-metadata.js` üzerinden okunur.
- Arayüz dili İngilizce kalır.

## 3. Düzen

Masaüstü (≥ 1100 px):

```
┌ Üst çubuk: marka · [Arama düğmesi  /] · Standard ▾ · Source code · Help ┐
├──────────────── 396 px ───────────────┬──────────── esnek ──────────────┤
│ Sembol kartı (sticky)                  │ Yapılandırma kartı              │
│  ad, yol, Unit/Equipment rozeti        │  Sekmeler: Symbol ·             │
│  önizleme (≈214 px) + render durumu    │  Text amplifiers [n filled] ·   │
│  Field positions · Grid · Outline      │  Graphics and display           │
│  Download SVG · PNG · Copy SVG         │  ... Reset modifiers            │
│ SIDC konsolu                           │  Sekme içeriği: iki sütunlu      │
│  giriş + Apply · uzunluk · durum satırı│  kartlar                        │
│  kod dökümü (anlamlarıyla) · Copy SIDC │                                 │
│ Kaynak notu · audit bağlantısı · lisans│                                 │
└────────────────────────────────────────┴─────────────────────────────────┘
```

Dar ekran (< 1100 px): iki sütun alt alta düşer. Sembol kartı yukarıda kalır. Yapılandırma başlığındaki küçük önizleme bağlantısı (bugünkü `compactPreview`) korunur ve sembol kartına götürür.

Arama paneli: üst çubuktaki düğmeye tıklayınca ya da `/` ile açılır. Sayfanın üstüne, arka planı karartarak açılan bir paneldir:

- Solda sembol setleri ve sayıları
- Sağda mini önizlemeli sonuç ızgarası
- Boş aramada üstte "Recently used"
- Altta klavye ipuçları

## 4. Mevcut özelliklerin yeni yerleri (eşitlik tablosu)

| # | Bugünkü özellik | Yeni yeri |
|---|---|---|
| 1 | Marka bağlantısı | Üst çubuk (aynı) |
| 2 | 7 standart seçimi (APP-6A/B/D/E, 2525C/D/E), varsayılan APP-6A; geçişte ülke korunur, seçim piyadeye döner | Üst çubuk (aynı davranış) |
| 3 | Source code bağlantısı | Üst çubuk |
| 4 | Help diyaloğu | Üst çubuk; metne yeni özellikler eklenir |
| 5 | İsim, kategori, kod, id ve yol araması (aksan duyarsız) | Arama paneli |
| 6 | Aramaya tam SIDC yazınca o sembolü bulma (harf ve sayı) | Arama paneli (aynı kural) |
| 7 | Aramayı temizleme düğmesi, Esc, `/` kısayolu | Arama paneli: × düğmesi; Esc önce metni temizler, ikinci Esc paneli kapatır |
| 8 | Symbol set filtresi | Arama panelinde sol liste (sayılarla) |
| 9 | Sonuç sayısı | Arama paneli başlığı |
| 10 | Mini önizlemeler (dost / mevcut, güncel palet ve çizgi kalınlığıyla) | Arama paneli ızgarası (aynı `safeMiniSvg`) |
| 11 | APP-6A "Category" rozeti ve açıklaması | Arama paneli kutusu ve sembol kartı başlığı |
| 12 | 40'lık sayfalama, "Show more · N" | Arama paneli altı |
| 13 | Boş sonuç mesajı | Arama paneli |
| 14 | Seçili vurgu, `aria-pressed`, odağın geri gelmesi | Arama paneli |
| 15 | Son seçilen sembolü standart başına hatırlama (localStorage) | Korunur ve "Recently used" listesine genişler (bölüm 5.10) |
| 16 | "Symbol names follow the selected standard" notu | Arama paneli altı |
| 17 | Seçili sembol adı, yolu, "/ Imported SIDC" eki | Sembol kartı başlığı |
| 18 | Dar ekranda küçük önizleme bağlantısı | Yapılandırma başlığı (dar ekranda) |
| 19 | Kimlik seçimi (4; APP-6A'da 9); sembol kimliği önceden belirliyorsa kilitli | Symbol sekmesi: şekilli çipler (bölüm 5.1); kilit kuralı aynı |
| 20 | Context (Reality / Exercise / Simulation), D/E sürümlerinde | Symbol sekmesi, kimlik kartının yanında (yalnız D/E) |
| 21 | Durum (APP-6A'da 2, diğerlerinde 6) | Symbol sekmesi: şekilli çipler |
| 22 | HQ, Task force ve Feint onay kutuları ve devre dışı kuralları (installation, tactical point, mobility, unit/equipment) | Symbol sekmesi "Unit designation" kartı; kurallar aynı, gerekçe metni görünür |
| 23 | Echelon / Mobility / None seçimi ve değer listeleri (15 / 13; APP-6A'da N, NS, NL yok); bilinmeyen kodlar "SIDC: kod" olarak korunur | Symbol sekmesi "Echelon / mobility" kartı (aynı) |
| 24 | Frame shape override (E, konum 23) | Symbol sekmesi "Edition-specific" kartı (yalnız E) |
| 25 | Icon modifier 1/2 (D/E), katalog ve ortak listeler gruplu; bilinmeyen kod korunur | Symbol sekmesi "Edition-specific" kartı (yalnız D/E) |
| 26 | Sürüm notları (installation H otomatik, tactical point, ikon varyantı kütüphaneden) | İlgili kartların altındaki not satırları |
| 27 | 5 grupta 27 metin alanı; APP-6A'da yalnız uygulanabilenler, sınır ve placeholder, Table III notu | Text amplifiers sekmesi; uygulanamayanlar artık gerekçeyle listelenir (bölüm 5.4) |
| 28 | Hareket yönü (kapalı veya 0–360), APP-6A noktalarında kapalı | Graphics sekmesi: pusula, kaydırıcı, sayı girişi, N/E/S/W/Off |
| 29 | Speed leader (AJ) | Graphics sekmesi |
| 30 | HQ staff length (S) | Graphics sekmesi; HQ kapalıyken gerekçeyle devre dışı |
| 31 | Fill, Frame, Icon, Text labels anahtarları | Graphics sekmesi "Display" kartı |
| 32 | Renk paleti Light / Medium / Dark | Graphics sekmesi "Style" kartı |
| 33 | Ülke / kuruluş bayrağı (yaklaşık 270 bayrak + NATO), sürüme göre SIDC ülke alanıyla iki yönlü bağlı, yalnız görüntülenen bayraklar, "Flags unavailable" yedeği | Symbol sekmesi "Country / organization" kartı (SIDC'ye yazdığı için); bayrağı göster/gizle anahtarı Display kartında |
| 34 | Symbol stack 1–6 (APP-6A'da kapalı) | Graphics sekmesi "Style" kartı |
| 35 | Symbol size 55–170 % | Graphics sekmesi "Style" kartı |
| 36 | Stroke width 1–8 | Graphics sekmesi "Style" kartı |
| 37 | Reset modifiers (gizli alanlar dahil her şeyi sıfırlar) | Yapılandırma sekme çubuğunun sağı; yeni stil seçeneklerini de sıfırlar |
| 38 | Render durumu (Rendered / Check code / modifiers ve hata başlığı / Rendering error) | Sembol kartı başlığı; hata ayrıntıları SIDC durum satırına da yazılır |
| 39 | Grid ve Outline düğmeleri (Outline = beyaz hale, kalınlık 7) | Sembol kartı önizleme araç çubuğu (aynı davranış) |
| 40 | "Transparent background" etiketi | Önizleme araç çubuğu |
| 41 | Download SVG, PNG (3×, saydam), Copy SVG | Sembol kartı (aynı) |
| 42 | SIDC girişi: uzunluk, Apply, Enter, doğrulama (D/E için 20–30 hane, harf için 10–15 karakter, APP-6A'da S zorunlu), `*` çözümü, D/E sürümüne otomatik geçiş, SIDC'den bayrak seçimi, Copy SIDC | SIDC konsolu (aynı kurallar), mesajlar artık satır içinde (bölüm 5.2) |
| 43 | Code breakdown (harf: 8 parça; D ve E için ayrı parçalar) | SIDC konsolunda her zaman açık, anlamlarıyla birlikte |
| 44 | Kaynak notu (APP-6A sayfası, katalog sayısı, Category notu, remarks; APP-6E uyumluluk notu) | Sembol kartı altı |
| 45 | Publication audit bağlantısı (yalnız yerel build) | Sembol kartı altı |
| 46 | milsymbol bağlantısı, Licenses & attribution, bağımsızlık notu | Sembol kartı altı |
| 47 | Toast bildirimleri | Korunur; SIDC mesajları satır içine taşınır |
| 48 | Sayfa başlığının sembol adıyla güncellenmesi | Aynı |
| 49 | İçe aktarılan SIDC'de kontrol değişikliğinin yalnız kendi alanını yazması (`editImportedSidc`) | Aynı |
| 50 | Katalog yüklenemezse hata durumu | Arama paneli ve sembol kartı |
| 51 | Sekmelerde ok tuşları, Home ve End ile gezinme | Aynı |

## 5. Yeni özellikler

### 5.1 Şekilli kimlik ve durum çipleri

- Her çipteki çerçeve, milsymbol ile mevcut sembolün kimliği değiştirilerek çizilir. Böylece ekipman, hava ve deniz gibi her boyutta doğru şekil görünür.
- Etiketler şunlardır: Pending, Unknown, Assumed friend, Friend, Neutral, Suspect, Hostile, Joker, Faker. APP-6A dışındaki standartlarda yalnız ilk dördü kullanılır.
- Durum çipleri de aynı şekilde çizilir (planned için kesik çizgi).
- D/E sürümlerinde 6 durum gösterilir, APP-6A'da 2.

### 5.2 SIDC konsolu

- Giriş alanı mevcut kodu gösterir. Düzenlenince "Not applied yet. Press Enter or Apply." uyarısı çıkar ve Apply vurgulanır.
- Esc taslağı bırakıp mevcut koda döner.
- Doğrulama ve uygulama mesajları toast yerine satır içinde görünür:
  - Uygulandı (yeşil).
  - Hata (kırmızı): hangi kural kırıldı. Kurallar bugünküyle aynı.
  - Bilgi (mavi): örneğin `*` çözüldü, sürüm değişti, ülke kodu tanınmadı.
- Kod dökümü bugünkü parçaları kullanır. Her parçanın altına anlamı yazılır, örneğin "F · Friend", "UCI--- · Infantry", "TU · Türkiye".
- Render sonrası `isValid(true).modifierErrors` ve APP-6A `metadata.validation.details` varsa durum satırında listelenir.

### 5.3 Alan konumları (Field positions)

- Önizleme araç çubuğuna "Field positions" düğmesi eklenir.
- Açıkken önizleme, uygulanabilir boş alanların yerine kodlarını (T, M, W…) yazarak ikinci bir çizim yapar. Etiketler, bilerek mavi renk ve açık arka planla çizilir.
- Bir etikete tıklayınca Text amplifiers sekmesi açılır ve o alana odaklanılır.
- Dışa aktarma bu görünümden etkilenmez; her zaman normal çizim kullanılır.
- Kütüphane tüm metin alanlarına aynı `milsymbol-textfields` sınıfını verir. Etiket ile alan eşleştirmesi, yer tutucu metnin içeriğiyle yapılır.

### 5.4 Metin alanları sekmesi

- 27 alan 5 grupta, iki sütunda gösterilir.
- Her alanda kod etiketi ve karakter sayacı (`4 / 21`) vardır. Açıklama, alana odaklanınca görünür.
- APP-6A'da uygulanamayan alanlar gizlenmez. Grubun altında tek satır olarak gerekçesiyle durur: "Equipment only", "Units only", "Hostile or suspect only", "Not in APP-6A". "Hide unavailable" ile gizlenebilir.
- Diğer standartlarda 27 alanın hepsi açıktır (bugünkü gibi).
- Sekme başlığında doldurulan alan sayısı gösterilir.

### 5.5 Alan yardımı ve başvuru tabloları (referans siteden)

Odaklanılan alanın açıklamasının altında, gerekiyorsa "Reference" açılır bölümü çıkar:

- J Evaluation rating: güvenilirlik A–F ve doğruluk 1–6 tablosu.
- AO Engagement bar: `A:BBB-CC` biçimi; aşama kodları (ASN, ENG, MIF, CF, CE, HF, TE, BE, MBE, M<T, MLT) ve silah/varlık kodları.
- W Date-time group: `DDHHMMZMONYY` biçimi ve "O/O" (on order).
- Y Location: kabul edilen biçimler (MGRS, derece-dakika).

### 5.6 Alan yardımcıları

- **W:** "Now (UTC)" düğmesi şimdiki zamanı `DDHHMMZMONYY` biçiminde yazar ve sürümün karakter sınırına uyar.
- **J:** iki küçük seçim (A–F, 1–6) değeri yazar. Elle yazmak da mümkündür.
- **L Signature equipment:** referans sitedeki gibi seçimdir ("Not applicable" ya da "!").

### 5.7 Yeni stil seçenekleri (kütüphanenin desteklediği)

Graphics sekmesine "Advanced style" kartı eklenir:

| Seçenek | milsymbol stili |
|---|---|
| Custom fill color (renk seçici, sıfırlanabilir) | `fillColor` |
| Monochrome (renk seçici) | `monoColor` |
| Fill opacity | `fillOpacity` |
| Text color | `infoColor` |
| Text size | `infoSize` |
| Text background | `infoBackground` |
| Outline width ve color (bugünkü Outline düğmesinin ayarları) | `outlineWidth`, `outlineColor` |

Hepsi SVG ve PNG dışa aktarımına girer. SIDC'yi değiştirmez. Reset hepsini varsayılana döndürür.

### 5.8 Graphics sekmesi düzeni

- Direction of movement (Q): pusula görünümü, kaydırıcı, sayı girişi, N/E/S/W/Off kısayolları.
- Graphic amplifiers: AJ ve S.
- Display: Fill, Frame, Icon, Text labels ve Country flag.
- Style: palet, boyut, çizgi kalınlığı, stack.
- Advanced style: bölüm 5.7.

### 5.9 Unit / Equipment rozeti ve gerekçeli devre dışı durumlar

- Sembol kartında APP-6A sınıfı gösterilir: Unit, Equipment, Installation, Tactical point.
- Devre dışı her kontrolün yanında nedeni yazar, örneğin "Mobility uses positions 11–12".

### 5.10 Recently used

Standart başına son 8 sembol tutulur (localStorage, try/catch ile). Arama paneli boşken üstte gösterilir. Bugünkü "son sembolü aç" davranışı korunur.

## 6. Dosya değişiklikleri

- `studio/index.html`: yeni iskelet. Mevcut kontrollerin `id` değerleri korunur ki `app.js` mantığı ve testler kırılmasın.
- `studio/styles.css`: yeni düzen. Renkler, yazı tipi ve yoğunluk bugünkü tasarım dilinde kalır.
- `studio/app.js`: mantık yerinde kalır, arayüz bağlantıları yeni yerlere göre güncellenir.
- Arama paneli, klavye gezinmesi ve recently used `app.js` içinde kalır, çünkü katalog ve seçim durumuna bağlı. Listeyi güncelleyen saf `pushRecent` fonksiyonu `editor-helpers.js` içindedir.
- `studio/editor-helpers.js` (yeni, saf fonksiyonlar):
  - `fieldAvailability`: alan uygulanabilirliği ve gerekçesi.
  - `formatDtg`: DTG biçimi.
  - `evaluationRating`: J değeri.
  - `sidcParts`: kod dökümü parçaları (anlamları `app.js` ekler).
  - `pushRecent`: son kullanılanlar listesi.
  - `placeholderOptions`: alan konumu görünümü için seçenekler.
- `studio/field-reference.js` (yeni): bölüm 5.5'teki tablolar.
- `scripts/build-studio.mjs`: yeni dosyalar kopyalama listesine ve public izin listesine eklenir.
- `STUDIO.md`: yeni düzen ve özellikler belgelenir.

## 7. Test ve doğrulama

1. Mevcut testlerin hepsi geçmeli:
   `NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22' npx tead`
2. Yeni birim testi `test/studio-editor-helpers.test.js`:
   - Alan uygulanabilirliği ve gerekçeleri (APP-6A unit, equipment, hostile equipment, installation, point; diğer standartlar).
   - DTG biçimi ve karakter sınırı.
   - J değeri.
   - Harf ve D/E kod dökümleri.
   - Alan konumu yer tutucuları.
3. `npm run studio:build` ve `npm run studio:build:public` hatasız bitmeli (izin listesi kontrolü dahil).
4. Tarayıcıda 7 standartta elle kontrol listesi (önizleme sunucusuyla):
   - Bölüm 4'teki 51 madde.
   - Bölüm 5'teki yeni özellikler.
   - Dar ekran.
   - Konsolda hata olmaması.

## 8. Kapsam dışı

| Referans sitedeki özellik | Neden dahil değil |
|---|---|
| Favorites | Kullanıcı istemedi. |
| ORBAT, harita, koordinat dönüştürücü | Ayrı araçlar, sembol düzenleme değil. |
| Range (menzil halkaları) | Harita üzerinde çizilir, SVG sembolünün parçası değil. |
| General stars | Standart bir sembol modifier'ı değil; STUDIO.md bunu ayrı özellik olarak not ediyor. |
| Full frame flag renk modu | Kütüphanede yok; standart dışı görünüm. |
| Ana ikon ve modifier listelerinde ikonlu açılır menü | Bu sürümde değil. Ana ikon zaten arama panelinde ikonlu; modifier listeleri bugünkü gibi metin olarak kalır. |

## 9. Açık konu

Yok. Bölüm 8'deki maddelerden biri isteniyorsa onay sırasında belirtilmeli.
