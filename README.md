# UniPop – Espace Formateurs

Ressourcen-Dashboard für Formateur·rice·s der Université populaire du Luxembourg.
Die Seite wird auf **GitHub Pages** gehostet und per **iFrame** in die bestehende
WordPress-Seite „Formateur“ eingebettet. Die Oberfläche ist auf Französisch, diese
Anleitung auf Deutsch.

Alle Inhalte (Texte, Links, PDFs, Videos, Ankündigungen, Daten) stehen in **einer**
Datei: `data/content.json`. HTML muss für den laufenden Betrieb nie bearbeitet werden.

> **Wichtig – alles ist öffentlich.** Die WordPress-Seite ist zwar nicht verlinkt,
> aber nicht geschützt, und ein GitHub-Pages-Repository ist für jeden lesbar.
> Niemals vertrauliche Dokumente, personenbezogene Daten, Passwörter, LuxTrust-Daten
> oder API-Schlüssel hochladen.

**Vorschau mit Beispielinhalten:** Adresse mit `?demo` aufrufen, z. B.
`https://letzbug.github.io/unipop-espace-formateurs/?demo`. Dann werden die fiktiven
Inhalte aus `data/content.demo.json` angezeigt (mit gelbem Hinweisbanner). So sieht
man jede Rubrik vollständig befüllt und kann Filter, Archiv, Videos usw. testen.

---

## Was bereits eingetragen ist – und was nicht

Die aktuelle Seite unipop.lu/formateur-unipop/ lädt ihre Inhalte per JavaScript und
konnte deshalb nicht automatisch ausgelesen werden. Es wurden **keine Links erfunden**:

| Bereits eingetragen | Quelle |
|---|---|
| Tarif-Vorschau (SFA003–SFA007, Index 968,04) | aus dem PDF auf dem Screenshot der aktuellen Seite abgeschrieben – bei jeder Indexierung prüfen, das PDF ist maßgeblich |
| Instagram `unipopluxembourg` | Profilname auf dem Screenshot |
| Adresse Belval (Onboarding › Informations pratiques) | öffentliche Angabe, bitte prüfen |
| Link „Assistance LuxTrust“ | offizielle Website luxtrust.com |

Alles andere ist mit **`A_COMPLETER: …`** markiert. Die Seite zeigt diese Stellen als
„Bientôt disponible“ an, statt tote Links zu erzeugen. Suchen Sie in `content.json`
nach `A_COMPLETER`, um alle offenen Punkte zu finden (siehe Abschnitt 3).

---

## Inhalt des Pakets

```
index.html                 Seitengerüst (nicht bearbeiten nötig)
css/styles.css             Gestaltung; Farben/Schriften als Variablen oben in der Datei
js/app.js                  baut die Seite aus content.json
js/iframe-resize.js        meldet die Höhe an WordPress (automatische iFrame-Höhe)
data/content.json          ← ALLE Inhalte (diese Datei pflegen)
data/content.demo.json     fiktive Beispielinhalte für ?demo
assets/documents/          PDFs, Word-Dateien
assets/flyers/             Flyer-PDFs
assets/thumbnails/         Vorschaubilder (Tutorials, Flyer)
assets/images/  assets/videos/  assets/icons/  assets/fonts/
assets/demo/               Dateien nur für den Demo-Modus (darf gelöscht werden*)
tools/test-integration.html  lokaler Test „wie in WordPress“
wordpress-embed.html       Code zum Einfügen in WordPress
.nojekyll                  sorgt dafür, dass GitHub Pages alle Dateien unverändert ausliefert
```
\* Wer `assets/demo/` löscht, sollte auch `data/content.demo.json` löschen.

---

## 1. Welche Dateien zu GitHub hochladen

**Alle** Dateien und Ordner aus dem ZIP, mit unveränderter Ordnerstruktur, inklusive
der versteckten Datei `.nojekyll`.

1. Auf github.com (Konto `letzbug`) **New repository** → Name z. B.
   `unipop-espace-formateurs` → **Public** (GitHub Pages im Gratis-Tarif erfordert ein
   öffentliches Repository) → **Create repository**.
2. **Add file → Upload files** → den *Inhalt* des entpackten Ordners hineinziehen
   (nicht den Ordner selbst – `index.html` muss im Hauptverzeichnis liegen).
3. Unten **Commit changes**.

Hinweis: Der Web-Upload zeigt versteckte Dateien wie `.nojekyll` manchmal nicht an.
Falls sie fehlt: **Add file → Create new file**, Name `.nojekyll`, leer lassen, Commit.

## 2. GitHub Pages aktivieren

1. Im Repository **Settings → Pages**.
2. *Source*: **Deploy from a branch**; *Branch*: **main**, Ordner **/ (root)** → **Save**.
3. Nach 1–2 Minuten erscheint oben die Adresse, z. B.
   `https://letzbug.github.io/unipop-espace-formateurs/`.

Änderungen an `content.json` sind nach jedem Commit innerhalb von etwa 1–10 Minuten
sichtbar (GitHub baut die Seite neu und speichert sie kurz zwischen). Bei Bedarf die
Seite mit Strg+F5 bzw. Cmd+Shift+R neu laden.

Alle Pfade sind relativ – die Seite funktioniert daher auch unter einem Unterpfad wie
`/unipop-espace-formateurs/` und später unter einer eigenen Domain.

## 3. Bestehende UniPop-Links eintragen

`data/content.json` auf GitHub öffnen → Stift-Symbol (**Edit this file**) → mit
**Strg+F** nach `A_COMPLETER` suchen → jeweils den ganzen Text zwischen den
Anführungszeichen ersetzen.

```json
"url": "A_COMPLETER: lien du bouton « Desiderata » de la page actuelle"
```
wird zu
```json
"url": "https://… (Adresse des Desiderata-Formulars)"
```

Die wichtigsten Stellen (die URLs findet man auf der aktuellen WordPress-Seite per
Rechtsklick auf den Button → „Link-Adresse kopieren“):

| Button auf der aktuellen Seite | Feld in content.json |
|---|---|
| Desiderata | `sections.desiderata.formulaire.url` |
| Tarifs | `sections.tarifs.document.url` |
| Flyer (PDF) | `sections.flyers.flyers[0].fichier` |
| Accréditation (PDF) | `sections.onboarding.rubriques[1].documents[0].url` |
| Contact | `entete.acces_rapides[3].cible` (z. B. `mailto:adresse@…`) |
| YouTube-Video | `sections.videos.videos[0].url` |
| YouTube-Kanal | `sections.videos.liens[0].url` |

Erlaubt sind `https://…`-Adressen, relative Pfade zu eigenen Dateien
(`assets/documents/tarifs.pdf`), `mailto:` und `tel:` sowie `#rubrik` für Sprünge
innerhalb der Seite (z. B. `#tarifs`). Ein leerer Wert oder `A_COMPLETER…` wird
als „Bientôt disponible“ angezeigt.

**JSON-Regeln** (häufigste Fehler): Texte immer in `"…"`; zwischen Einträgen ein
Komma, nach dem letzten Eintrag einer Liste **kein** Komma; Anführungszeichen im Text
als `\"` schreiben oder typografische « » / ’ verwenden. Bei einem Fehler zeigt die
Seite selbst die betroffene Zeile an.

## 4. PDF hinzufügen oder ersetzen

PDFs am besten **ins Repository kopieren** (statt auf unipop.lu zu verlinken): dann
funktionieren der Download-Button und die eingebettete Vorschau zuverlässig.

1. Repository → Ordner `assets/documents` → **Add file → Upload files** → PDF wählen.
   Dateinamen ohne Leerzeichen und Umlaute, z. B. `tarifs-2026.pdf`.
2. In `content.json` den Pfad eintragen, z. B. für die Tarife:
   ```json
   "document": {
     "titre": "Grille tarifaire en vigueur",
     "url": "assets/documents/tarifs-2026.pdf",
     "format": "PDF",
     "apercu_pdf_integre": true
   }
   ```
3. Commit.

**Ersetzen:** dieselbe Datei mit *gleichem Namen* erneut hochladen (überschreibt sie),
oder neuen Namen verwenden und den Pfad anpassen. Alte Dateien kann man im Ordner
über **… → Delete file** entfernen.

**Tarif-Vorschau (Tabelle):** steht unter `sections.tarifs.apercu_tableau`. Nach jeder
Indexierung die Werte in `lignes` aktualisieren oder mit `"afficher": false` ausblenden –
dann wird nur noch das PDF angeboten. `colonnes_secondaires` legt fest, welche Spalten
auf schmalen Bildschirmen ausgeblendet werden (Zählung ab 0).

Weitere Dokumente (Règlements, Ressourcen …) haben immer diese Form:
```json
{ "titre": "Règlement UniPop", "url": "assets/documents/reglement.pdf", "format": "PDF" }
```

## 5. Flyer hinzufügen

**Allgemeiner Flyer** (Rubrik „Flyers“; der erste Eintrag wird groß dargestellt):
1. PDF nach `assets/flyers/` hochladen, Vorschaubild (JPG/PNG/WebP, ca. 800 px breit,
   Querformat 16:10) nach `assets/thumbnails/`.
2. In `sections.flyers.flyers` eintragen:
   ```json
   {
     "titre": "Flyer général UniPop",
     "description": "Envie de découvrir l’univers UniPop ?",
     "fichier": "assets/flyers/flyer-general.pdf",
     "vignette": "assets/thumbnails/flyer-general.jpg"
   }
   ```

**Thematischer Flyer** (Rubrik „Flyers spécifiques“, mit Filter):
1. PDF nach `assets/flyers/`, Vorschaubild (Hochformat 4:5) nach `assets/thumbnails/`.
2. In `sections.flyers_specifiques.flyers` ergänzen:
   ```json
   { "titre": "Yoga doux", "categorie": "Yoga", "fichier": "assets/flyers/yoga.pdf", "vignette": "assets/thumbnails/yoga.jpg" }
   ```
3. `categorie` muss genau einem Eintrag aus `sections.flyers_specifiques.categories`
   entsprechen. Neue Themen einfach in diese Liste aufnehmen – Filter-Buttons und Zähler
   entstehen automatisch. Ohne Vorschaubild erscheint ein farbiges Platzhalterbild.

## 6. Video hinzufügen

YouTube-Link (normaler Link, `youtu.be`-Kurzlink oder Shorts) in `sections.videos.videos`
eintragen. **Der erste Eintrag** ist das große Video; weitere erscheinen als Liste darunter.
```json
{ "titre": "Présentation de l’UniPop", "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX", "duree": "2:45", "vignette": "" }
```
- `vignette` leer lassen → das YouTube-Vorschaubild wird verwendet.
- Videos laden erst beim Klick (über youtube-nocookie.com) – das spart Ladezeit und
  vermeidet unnötige Verbindungen zu YouTube.
- Auch möglich: Vimeo-Links oder eigene MP4-Dateien in `assets/videos/` (Dateien
  über 25 MB lassen sich nicht im Browser hochladen; GitHub-Limit 100 MB – YouTube ist
  meist die bessere Wahl).
- Tutorial-Videos funktionieren gleich: `sections.tutoriels.elements[].video` bzw.
  `sections.tutoriels_gicea.tutoriels[].video`. Ein zusätzlicher Leitfaden als PDF kommt
  in `document` (Tutoriels) bzw. `guide` (GICEA). Schritt-für-Schritt-Anleitungen für GICEA
  als Liste in `etapes` – nur mit fiktiven Beispieldaten, nie mit echten Namen.

## 7. Neue Ankündigung veröffentlichen

In `sections.actualites.annonces` einen Eintrag hinzufügen (Reihenfolge egal – die Seite
sortiert automatisch: angeheftete zuerst, dann neueste zuerst):
```json
{
  "titre": "Nouveaux tarifs 2026/2027",
  "resume": "Les grilles tarifaires sont en ligne.",
  "date": "2026-11-05",
  "categorie": "Tarifs",
  "lien": "#tarifs",
  "epingle": false,
  "important": true,
  "date_expiration": "2026-12-31"
}
```
| Feld | Wirkung |
|---|---|
| `date` | Datum der Meldung. **Liegt es in der Zukunft, erscheint die Meldung erst an diesem Tag** (geplante Veröffentlichung). |
| `date_expiration` | optional – ab dem Folgetag automatisch ausgeblendet |
| `categorie` | Farbe des Punkts über `sections.actualites.categories` (`teal`, `mint`, `lavender`, `blue`, `coral`, `amber`, `navy`) |
| `lien` | optional – Webadresse, Dokument oder `#rubrik` (springt zur Karte) |
| `epingle` | `true` = bleibt oben |
| `important` | `true` = rote Markierung |

`nombre_affiche` (Standard 4) bestimmt, wie viele Meldungen sofort sichtbar sind; der
Rest erscheint über „Voir toutes les actualités“.

## 8. Appel à concept anlegen und archivieren

In `sections.appels_a_concept.appels` eintragen:
```json
{
  "titre": "UniPop COURSE LAB – Printemps 2027",
  "description": "Proposez un nouveau format de cours pour le semestre de printemps.",
  "date_publication": "2027-01-15",
  "date_limite": "2027-03-31",
  "lien": "assets/documents/course-lab-printemps-2027.pdf",
  "document": "assets/documents/course-lab-printemps-2027.pdf"
}
```
(Daten im Beispiel sind Platzhalter.)

Der Status wird **nur aus den Daten berechnet** – nichts muss manuell verschoben werden:
- vor `date_publication` → unsichtbar (kann also im Voraus eingetragen werden),
- bis einschließlich `date_limite` → „Appel en cours“ (mehrere laufende Aufrufe:
  der mit der nächsten Frist wird groß gezeigt, mit Countdown ab 30 Tagen),
- ab dem Tag nach `date_limite` → automatisch im Ordner „Anciens appels à concept“.
- Vorzeitig archivieren: `"statut": "archive"` hinzufügen.

Den Eintrag nach Ablauf also einfach stehen lassen – er bildet das Archiv.

## 9. In WordPress einbetten

1. `wordpress-embed.html` öffnen (Texteditor) und **zwei Stellen** anpassen:
   `src="https://letzbug.github.io/unipop-espace-formateurs/"` (vollständige Adresse) und
   `IFRAME_ORIGIN = 'https://letzbug.github.io'` (nur Protokoll + Domain, ohne Pfad).
2. WordPress → Seiten → „Formateur“ bearbeiten.
3. An der Stelle, an der heute der Inhalt (Tarife/YouTube-Kacheln) steht, den alten Inhalt
   entfernen und einen Block **„Individuelles HTML“** (*Custom HTML*) einfügen.
   Classic Editor: Reiter **Text** (nicht „Visuell“). Elementor: Widget **HTML**.
   Divi: Modul **Code**.
4. Den Block **Variante A** (von `VARIANTE A – ANFANG` bis `ENDE`) hineinkopieren →
   Vorschau prüfen → **Aktualisieren**.

Kontrolle: Der Rahmen hat keine eigene Bildlaufleiste und wächst mit dem Inhalt; die
Kacheln „Tarifs“ und „Onboarding“ im Kopfbereich scrollen die WordPress-Seite zur
Rubrik. `HEADER_OFFSET` (Standard 140) im Skript an die Höhe der UniPop-Kopfzeile anpassen,
falls die Rubrik nach dem Sprung unter dem Menü verschwindet.

**Sicherheit:** Das Skript reagiert nur auf Nachrichten von `IFRAME_ORIGIN` *und* nur aus
genau diesem iFrame und prüft die Höhe auf plausible Werte. Umgekehrt akzeptiert die
Dashboard-Seite nur Seiten aus `integration.origines_parent_autorisees` in `content.json`
(voreingestellt: `https://www.unipop.lu`, `https://unipop.lu`). Läuft die WordPress-Seite
unter einer anderen Adresse (z. B. Staging), diese dort ergänzen.

**Wenn WordPress das `<script>` oder das `<iframe>` entfernt:** Das passiert, wenn das
Benutzerkonto nicht die Berechtigung „unfiltered_html“ hat (typisch für Redakteure bzw.
Multisite-Installationen). Möglichkeiten, in dieser Reihenfolge:
1. Eine Person mit Administratorrechten fügt den Block ein.
2. Plugin wie **WPCode** (Code-Snippets) nutzen: das `<script>` als HTML-Snippet nur auf
   der Formateur-Seite ausgeben; der `<iframe>` bleibt im Block.
3. **Variante B** aus `wordpress-embed.html` verwenden (kein JavaScript nötig, siehe 10).

Falls die Website eine Content-Security-Policy mit `frame-src` verwendet, muss dort
`https://letzbug.github.io` erlaubt werden. GitHub Pages selbst erlaubt das Einbetten.

## 10. iFrame-Höhe ohne automatische Anpassung

Ohne das Skript kennt WordPress die Höhe des Inhalts nicht. **Variante B** in
`wordpress-embed.html` setzt deshalb eine feste Höhe, und das Dashboard scrollt innerhalb
des Rahmens (alle Funktionen bleiben nutzbar, auch die Sprünge zu den Rubriken):

```html
style="display:block;width:100%;height:85vh;min-height:640px;border:0;"
```
- `85vh` = 85 % der Fensterhöhe – so passt der Rahmen auf jeden Bildschirm.
- `min-height:640px` verhindert zu kleine Rahmen auf flachen Bildschirmen.
- Fester Wert statt `vh` ist möglich (z. B. `height:1800px`), führt aber auf Mobilgeräten
  (eine Spalte, deutlich höher) zu einem inneren Scrollbereich. Richtwerte der Gesamthöhe
  mit vollständig ausgefülltem Inhalt: ca. 3 000–3 500 px bei 1 000–1 260 px Breite,
  ca. 4 500 px bei 700 px, ca. 6 500 px bei 375 px.
- Breite: immer `width:100%` – das Dashboard passt sich der Spaltenbreite der Seite an.

---

## Welches Feld steuert welche Rubrik

| Rubrik auf der Seite | Bereich in `data/content.json` | Wichtigste Felder |
|---|---|---|
| Kopfbereich (Titel, Untertitel) | `entete` | `surtitre`, `titre`, `sous_titre` |
| Schnellzugriffe (4 Kacheln) | `entete.acces_rapides[]` | `titre`, `sous_titre`, `icone`, `couleur`, `cible` |
| Reihenfolge & Position aller Karten | `disposition` | `principale`, `secondaire`, `ressources` |
| A. Desiderata | `sections.desiderata` | `formulaire.url`, `date_limite`, `texte`, `documents[]` |
| B. Tutoriels | `sections.tutoriels` | `elements[]` (`titre`, `video`, `document`, `duree`, `vignette`), `nombre_affiche` |
| C. Onboarding | `sections.onboarding` | `introduction`, `rubriques[]` (`titre`, `icone`, `contenu`, `etapes`, `documents`) |
| D. Tarifs | `sections.tarifs` | `document.url`, `document.apercu_pdf_integre`, `apercu_tableau` |
| E. Flyers | `sections.flyers` | `flyers[]` (`titre`, `description`, `fichier`, `vignette`) |
| F. Flyers spécifiques | `sections.flyers_specifiques` | `categories[]`, `flyers[]` (`categorie`, `fichier`, `vignette`), `nombre_affiche` |
| G. Appels à concept | `sections.appels_a_concept` | `appels[]` (`date_publication`, `date_limite`, `statut`, `lien`, `document`) |
| H. Vidéos | `sections.videos` | `videos[]` (`url`, `titre`, `duree`, `vignette`), `liens[]` |
| I. Train the Trainer | `sections.train_the_trainer` | `sessions[]` (`date`, `horaire`, `lieu`, `inscription`), `ressources[]` |
| J. Actualités (News board) | `sections.actualites` | `annonces[]`, `categories`, `nombre_affiche` |
| K. Règlements | `sections.reglements` | `documents[]` (`titre`, `url`, `format`) |
| L. Modèle AVIWA | `sections.modele_aviwa` | `fichiers[]` (`format`, `url`, `taille`), `consignes` |
| M. Tutoriels GICEA | `sections.tutoriels_gicea` | `tutoriels[]` (`video`, `guide`, `etapes`), `depannage[]`, `liens[]`, `avertissement` |
| Fußzeile | `meta` | `derniere_mise_a_jour`, `pied_de_page` |
| Erlaubte WordPress-Adressen | `integration` | `origines_parent_autorisees` |

**Für jede Rubrik gilt außerdem:**
`visible` (`false` blendet die Karte aus), `titre`, `description`, `icone`, `couleur`
und `lien` (optionaler Pfeil oben rechts). `taille: "large"` lässt eine Karte im unteren
Bereich auf breiten Bildschirmen zwei Spalten belegen. Einträge, deren Name mit `_`
beginnt (`_aide`, `_modele`), sind Kommentare bzw. Kopiervorlagen und werden ignoriert.

**Symbole (`icone`):** `form`, `file`, `tag`, `cap`, `mail`, `coins`, `playCircle`,
`megaphone`, `video`, `image`, `book`, `calendar`, `clock`, `folder`, `users`, `gear`,
`shield`, `info`, `camera`, `link`, `bell`, `mapPin`, `check`, `external`, sowie die
Kurznamen `youtube`, `instagram`, `pdf`, `contact`, `luxtrust`.

**Texte mit Formatierung** (`introduction`, `contenu`, `texte`, `consignes`): Liste von
Zeilen; Zeilen mit `- ` am Anfang werden zur Aufzählung, `**fett**` und
`[Linktext](https://…)` sind möglich.

**Datumsformat:** immer `JJJJ-MM-TT` (z. B. `2026-11-30`). Ungültige Daten werden
ignoriert und in der Browser-Konsole gemeldet.

---

## Lokal testen (optional)

JSON-Dateien werden vom Browser nur über einen Webserver geladen, nicht per Doppelklick
auf `index.html`. Im entpackten Ordner:
```
python -m http.server 8000
```
Dann `http://localhost:8000/` (echte Inhalte), `http://localhost:8000/?demo` (Demo) und
`http://localhost:8000/tools/test-integration.html` (Einbettung wie in WordPress, mit
Breiten-Umschalter 1260 / 1000 / 900 / 700 / 480 / 375 px) öffnen.

## Fehlersuche

- **Seite zeigt „Le contenu de la page n’a pas pu être chargé“** → Syntaxfehler in
  `content.json`; die Meldung nennt Zeile und Spalte.
- **„Fichier introuvable“ an einem Button** → Pfad in `content.json` und Dateiname auf
  GitHub vergleichen (Groß-/Kleinschreibung zählt!). Die Seite prüft eigene Dateien
  automatisch; die Liste fehlender Dateien steht in der Browser-Konsole (F12).
- **Änderung nicht sichtbar** → einige Minuten warten, dann neu laden (Strg+F5).
- **PDF-Vorschau bleibt leer** → bei PDFs auf fremden Servern oder auf Mobilgeräten normal;
  PDF ins Repository kopieren. „Ouvrir“ und „Télécharger“ funktionieren immer.

## Schriften

Die Hausschrift **Gotham** ist kommerziell lizenziert und daher nicht enthalten. Ist sie auf
einem Rechner installiert, wird sie automatisch verwendet; sonst die mitgelieferte, frei
lizenzierte **Poppins** (SIL OFL, `assets/fonts/OFL.txt`). Besitzt die UniPop eine
Webfont-Lizenz für Gotham, die Dateien in `assets/fonts/` legen und oben in
`css/styles.css` ergänzen:
```css
@font-face { font-family: "Gotham"; src: url("../assets/fonts/gotham-book.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Gotham"; src: url("../assets/fonts/gotham-medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Gotham"; src: url("../assets/fonts/gotham-bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }
```
Farben stehen ebenfalls oben in `css/styles.css` (`--navy-900` = Hausfarbe #00164a).

## Technik in Kürze

HTML5, CSS (Grid, Container Queries), Vanilla JavaScript – kein Framework, kein Build,
keine Datenbank, keine externen Bibliotheken. Externe Verbindungen entstehen nur beim
Abspielen eines Videos (YouTube/Vimeo) bzw. für YouTube-Vorschaubilder. Barrierefreiheit:
semantische Struktur, vollständige Tastaturbedienung, sichtbarer Fokus, ausreichende
Kontraste, reduzierte Bewegung bei entsprechender Systemeinstellung, verzögertes Laden
von Bildern und Videos. Getestet bei 1260, 1200, 1000, 900, 700, 480 und 375 px Breite
ohne horizontales Scrollen.
