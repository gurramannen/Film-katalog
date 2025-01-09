# Film-katalog

# Filmbilbioteket

En modern och responsiv webbaserad applikation för att söka efter filmer med hjälp av 
[OMDb API](https://www.omdbapi.com/). Tanken är att låta dig söka efter filmer i realtid, 
visa detaljer om en specifik film i en modal.

## Funktioner
- Sök efter filmer dynamiskt medan du skriver.
- Visa resultat i en responsiv layout som anpassar sig efter skärmstorleken.
- Klicka på en film för att se detaljer (titel, genre, regissör, handling, och IMDb-betyg) i en modal.
- Responsiv design med fokus på användarvänlighet.

### Installation
1. **Kopiera projektet lokalt**:
   ```bash
   git clone https://github.com/gurramannen/Film-katalog
   cd Film-katalog
Öppna i webbläsaren: Öppna filen index.html i en webbläsare direkt från projektmappen.

Länk till Figma-skiss
[Visa Figma-design här](https://www.figma.com/design/zMlUpB2JdZ0rcrs7YSse8P/Film-katalog-wireframes?node-id=0-1&p=f&t=xRzMxPN9L3XnTZQe-0)

Uppfyllda krav
JSON, HTTP/HTTPS & Asynkronitet
JSON-hantering: Applikationen hämtar filmdata i JSON-format från OMDb API.
HTTP/HTTPS: Data hämtas via fetch() med en GET-förfrågan.
Asynkronitet: Användning av async/await och try/catch för att hantera fel. Felmeddelanden visas om inga sökresultat hittas.
UX/UI och Responsivitet
Designen anpassar sig efter olika skärmstorlekar (desktop, tablet, och mobil).
Semantisk HTML och WCAG (alt-texter, färgkontrast, tydlig navigation).
Feedback till användaren vid laddning av data, fel, eller tomma sökresultat.
Sökningen är dynamisk och uppdateras direkt när man skriver.
API-detaljer
API: OMDb API
Endpoint: https://www.omdbapi.com/
Parametrar:
s: Sökterm (exempel: "batman").
i: IMDb-ID för att hämta detaljer om en specifik film.
Exempel på URL:
Sök efter filmer: https://www.omdbapi.com/?apikey=your_api_key&s=batman
Hämtning av detaljer: https://www.omdbapi.com/?apikey=your_api_key&i=tt0372784

Sök efter filmer:

Skriv i sökfältet högst upp för att söka efter filmer. Resultaten uppdateras i realtid.
Visa detaljer om en film:

Klicka på ett filmkort för att öppna en modal med detaljerad information om filmen.
Stäng modalen: