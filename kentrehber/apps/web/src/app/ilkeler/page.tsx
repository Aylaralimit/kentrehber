export const metadata = { title: 'Yayın ilkeleri' };
export default function Principles() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.18em] text-accent">KENTREHBER</p>
      <h1 className="mb-10 mt-5 font-display text-5xl">Açık, sade, yerel.</h1>
      <div className="space-y-9 text-muted-foreground">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Rehber hakkında</h2>
          <p className="leading-7">
            KentRehber, şehirleri ve ilçeleri temel alan bir yerel işletme rehberidir. Görünüm ve
            bilgi alanları sektör yapılandırmasına göre belirlenir.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Görsel önizleme</h2>
          <p className="leading-7">
            Bu sürümde genel sayfa düzenleri gösterilir. İlanlar, görseller, arama sonuçları ve
            konum bilgileri henüz bağlı değildir. Gösterilen boş alanlar gerçek bir işletmeyi temsil
            etmez.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Gizlilik ve çerezler</h2>
          <p className="leading-7">
            Oturum ve gerektiğinde giriş onayı için zorunlu çerezler kullanılır. Giriş onayı cihazda
            30 gün saklanır. Bu arayüzde reklam veya analiz çerezi kullanılmaz.
          </p>
        </section>
      </div>
    </article>
  );
}
