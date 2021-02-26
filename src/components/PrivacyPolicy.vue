<template>
  <v-dialog
    v-model="dialog"
    width="500"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <span class="primary--text" v-bind="attrs" v-on="on">
        Polityką prywatności
      </span>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Polityka prywatności</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card flat max-width="1000" class="mx-auto">
          <v-card-title>Polityka prywatności</v-card-title>
        <v-card-text class="black--text text-subtitle-1">
          Realizując obowiązek informacyjny Administratora danych osobowych,
          uprzejmie informujemy, iż: <br><br><p>1. Administratorem Pani/Pana danych
          osobowych jest Uniwersytecki Szpital Kliniczny im. Jana Mikulicza-
          Radeckiego we Wrocławiu , ul. Borowska 213, 50-556 Wrocław , nr KRS
          0000136478, NIP 898-18-16-856, REGON 000289012,(dalej Administrator),
          którego przedstawicielem jest Dyrektor Szpitala .</p><p>2. Administrator
          powołał Inspektora Ochrony Danych, z którym można się kontaktować pod
          adresem e-mail: iod@usk.wroc.pl lub korespondencyjnie na adres
          Administratora. </p><p>3. Pani/Pana dane osobowe są przetwarzane przez
          Administratora wyłącznie w celu: • zawarcia i realizacji umowy
          cywilno-prawnej; • dochodzenia ewentualnych roszczeń; • udzielania
          odpowiedzi na Pani/Pana pisma, wnioski i skargi; • udzielania
          odpowiedzi w toczących się postępowaniach. </p><p>4. Podstawą prawną
          przetwarzania przez Administratora Pani/Pana danych osobowych jest: •
          art. 6 ust. 1 lit. b RODO, zgodnie z którego treścią dopuszcza się
          przetwarzanie danych osobowych jeśli jest to niezbędne do wykonania
          umowy, której stroną jest osoba, której dane dotyczą lub do podjęcia
          działań na żądanie osoby, której dane dotyczą, przed zawarciem umowy;
          • art. 6 ust.1 lit. c RODO - konieczność wypełnienia obowiązku
          prawnego ciążącego na Administratorze; • art.6 ust.1 lit. f RODO –
          niezbędność do celów wynikających z prawnie uzasadnionych celów
          realizowanych przez Administratora. </p><p>5. Pani/Pana dane osobowe mogą być
          przekazywane: • podmiotom przetwarzającym je na zlecenie
          Administratora; • organom lub podmiotom publicznym uprawnionym do
          uzyskania danych na podstawie obowiązujących przepisów prawa, np.
          sądom, organom ścigania lub instytucjom państwowym, gdy wystąpią z
          żądaniem, w oparciu o stosowną podstawę prawną. </p><p>6. Pani/Pana dane
          osobowe będą przechowywane w zależności od celu w jakim dane są
          przetwarzane. Okres, przez który Pani/Pana dane osobowe będą
          przechowywane jest obliczany w oparciu o następujące kryteria: • czas
          obowiązywania umowy; • przepisy prawa, które mogą obligować
          Administratora do przetwarzania danych przez określony czas; • okres,
          który jest niezbędny do obrony interesów Administratora. </p><p>7. Pani/Pana
          dane osobowe nie będą przekazywane do państwa trzeciego ani
          organizacji międzynarodowej. </p><p>8. Przysługuje Pani/Panu prawo dostępu do
          treści swoich danych, ich sprostowania, żądania ich usunięcia oraz
          ograniczenia ich przetwarzania. Pani/Pan może także skorzystać z
          uprawnienia do wniesienia sprzeciwu wobec ich przetwarzania oraz prawa
          do przenoszenia danych do innego Administratora danych. </p><p>9. W zakresie,
          w jakim Pani/Pana dane są przetwarzane na podstawie zgody – ma
          Pani/Pan prawo wycofania zgody na przetwarzanie danych w dowolnym
          momencie. Wycofanie zgody nie ma wpływu na zgodność z prawem
          przetwarzania, którego dokonano na podstawie Pani/Pana zgody przed jej
          wycofaniem. </p><p>10. Przysługuje Pani/Panu prawo wniesienie skargi do
          organu nadzorczego – Urzędu Ochrony danych Osobowych, gdy uzna
          Pani/Pan, iż ich przetwarzanie narusza unijne Rozporządzenie
          Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016
          r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych
          osobowych i w sprawie swobodnego przepływu takich danych oraz
          uchylenia dyrektywy 95/46/WE (tzw. ogólne rozporządzenie o ochronie
          danych osobowych, w skrócie RODO). </p><p>11. Pani/Pana dane osobowe nie
          podlegają zautomatyzowanemu podejmowaniu decyzji, w tym profilowaniu.</p>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["instituteName"],
  data: () => ({
    dialog: false,
  }),
};
</script>

<style></style>
