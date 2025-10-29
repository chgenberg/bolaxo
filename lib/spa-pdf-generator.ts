import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'

export interface SPAPdfData {
  // Parties
  sellerName: string
  sellerOrgNumber: string
  sellerAddress: string
  buyerName: string
  buyerOrgNumber: string
  buyerAddress: string
  
  // Company
  companyName: string
  companyOrgNumber: string
  companyAddress: string
  numberOfShares: number
  percentageOwned: number
  
  // Purchase terms
  purchasePrice: number
  closingDate: string
  paymentMethod: 'wire' | 'check' | 'other'
  paymentDueDate: string
  
  // Payment structure
  cashAtClosing: number
  escrowAmount: number
  escrowPeriod: string
  earnoutAmount?: number
  earnoutPeriod?: string
  earnoutKPI?: string
  
  // Terms
  representations: string[]
  warranties: string[]
  conditions: string[]
  nonCompetePeriod: string
  
  // Financial data
  financialData?: {
    latestRevenue?: number
    latestEBITDA?: number
    employees?: number
    lastFiscalYear?: string
  }
  
  // Extracted from documents
  extractedInfo?: Record<string, any>
}

type PDFDocumentType = InstanceType<typeof PDFDocument>

function addPageNumber(doc: PDFDocumentType, pageNum: number) {
  doc.fontSize(9)
    .text(`Sida ${pageNum}`, 50, doc.page.height - 30, { align: 'center' })
}

function createSectionHeader(doc: PDFDocumentType, title: string, sectionNum: number) {
  doc.fontSize(14).font('Helvetica-Bold')
  doc.text(`${sectionNum}. ${title}`, { underline: true })
  doc.moveDown(0.5)
  doc.fontSize(11).font('Helvetica')
}

function createParagraph(doc: PDFDocumentType, text: string, indent = 20, fontSize = 11) {
  doc.fontSize(fontSize).font('Helvetica')
  doc.text(text, {
    align: 'justify',
    indent,
    lineGap: 3
  })
  doc.moveDown(0.3)
}

export async function generateSPAPDF(data: SPAPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true
    })

    const buffers: Buffer[] = []
    let pageNum = 0

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
    doc.on('error', reject)

    // ===== TITLE PAGE =====
    doc.fontSize(24).font('Helvetica-Bold').text('AKTIEÖVERLÅTELSEAVTAL', { align: 'center' })
    doc.moveDown(1)
    doc.fontSize(14).font('Helvetica').text('(Share Purchase Agreement)', { align: 'center' })
    doc.moveDown(2)

    doc.fontSize(12).font('Helvetica-Bold').text(`För förvärv av ${data.companyName}`, { align: 'center' })
    doc.moveDown(3)

    doc.fontSize(11).font('Helvetica').text(`Mellan:\n${data.sellerName}\n(Säljare)\n\noch\n\n${data.buyerName}\n(Köpare)`, { align: 'center' })
    doc.moveDown(3)

    doc.fontSize(11).text(`Datum: ${new Date(data.closingDate).toLocaleDateString('sv-SE')}`, { align: 'center' })
    doc.moveDown(5)

    doc.fontSize(10).font('Helvetica').text('KONFIDENTIELLT\nFör auktoriserade mottagare endast', { align: 'center' })

    doc.addPage()
    pageNum++

    // ===== TABLE OF CONTENTS =====
    doc.fontSize(16).font('Helvetica-Bold').text('INNEHÅLLSFÖRTECKNING', { underline: true })
    doc.moveDown(0.5)
    
    const contents = [
      '1. Parter och bakgrund',
      '2. Föremålet för överlåtelsen',
      '3. Köpeskilling och betalningsvillkor',
      '4. Tilläggsköpeskilling (Earn-out)',
      '5. Villkor för tillträdet',
      '6. Due Diligence',
      '7. Garantier från säljaren',
      '8. Ansvar och ansvarsbegränsningar',
      '9. Sekretess och konkurrensförbud',
      '10. Tvistlösning',
      '11. Avslutsförfarande (Closing)',
      '12. Övriga bestämmelser',
      '13. Underteckningar'
    ]

    contents.forEach(content => {
      doc.fontSize(11).font('Helvetica').text(content, { indent: 20 })
      doc.moveDown(0.3)
    })

    doc.addPage()
    pageNum++

    // ===== SECTION 1: PARTER OCH BAKGRUND =====
    createSectionHeader(doc, 'Parter och bakgrund', 1)
    
    createParagraph(doc, `Detta aktieöverlåtelseavtal ("Avtalet") är upprättat mellan:

SÄLJARE: ${data.sellerName}
Organisationsnummer: ${data.sellerOrgNumber}
Adress: ${data.sellerAddress}

KÖPARE: ${data.buyerName}
Organisationsnummer: ${data.buyerOrgNumber}
Adress: ${data.buyerAddress}

Avtalet är daterat ${new Date(data.closingDate).toLocaleDateString('sv-SE')} (Giltighetsdatumet).

BAKGRUND

Säljaren är ägare av samtliga utgivna och utestående aktier i ${data.companyName}, organisationsnummer ${data.companyOrgNumber} (Bolaget).

Säljaren önskar sälja Bolaget till Köparen, och Köparen önskar förvärva Bolaget, på de villkor och med de förutsättningar som anges häri.

Parterna är överens om följande:`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 2: FÖREMÅLET FÖR ÖVERLÅTELSEN =====
    createSectionHeader(doc, 'Föremålet för överlåtelsen', 2)
    
    createParagraph(doc, `Säljaren överåtgår till Köparen samtliga ${data.numberOfShares} stamaktier i ${data.companyName} (organisationsnummer ${data.companyOrgNumber}), motsvarande ${data.percentageOwned}% av bolaget ("Aktierna").

Aktierna är fullt betalda och oreglerade från belastningar, pantsättningar eller andra rättigheter från tredje man.

Säljaren garanterar att han/hon har full äganderätt till Aktierna och att överlåtelsen är tillåten enligt bolagsordningen.`)

    doc.moveDown(0.5)
    createParagraph(doc, `Aktierna överlåts i befintligt skick utan några åtaganden från Säljaren utöver vad som uttryckligen anges i detta Avtal.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 3: KÖPESKILLING OCH BETALNINGSVILLKOR =====
    createSectionHeader(doc, 'Köpeskilling och betalningsvillkor', 3)
    
    createParagraph(doc, `3.1 Köpeskilling

Den totala köpeskillingen för Aktierna är ${data.purchasePrice.toLocaleString('sv-SE')} SEK (ordet: ${data.purchasePrice.toLocaleString()}).

3.2 Betalningsstruktur

Köpeskillingen fördelar sig enligt följande:

a) Kontant betalning vid Tillträdet (Closing): ${data.cashAtClosing.toLocaleString('sv-SE')} SEK

b) Spärrat belopp (Escrow): ${data.escrowAmount.toLocaleString('sv-SE')} SEK deponeras på spärrat bankkonto för ${data.escrowPeriod} som säkerhet för Säljarens garantier.

${data.earnoutAmount ? `c) Tilläggsköpeskilling (Earn-out): Upp till ${data.earnoutAmount.toLocaleString('sv-SE')} SEK under ${data.earnoutPeriod}, baserat på uppfyllnad av KPI (se Avsnitt 4).` : ''}

3.3 Betalningssätt

Betalning ska erläggas via banköverföring till Säljarens angivna bankkonto senast ${new Date(data.paymentDueDate).toLocaleDateString('sv-SE')}.

3.4 Äganderättsövergång

Äganderätten till Aktierna övergår till Köparen vid Tillträdesdagen när betalning i sin helhet har mottagits av Säljaren.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 4: EARN-OUT (om applicable) =====
    if (data.earnoutAmount) {
      createSectionHeader(doc, 'Tilläggsköpeskilling (Earn-out)', 4)
      
      createParagraph(doc, `4.1 Earn-out struktur

En tilläggsköpeskilling om upp till ${data.earnoutAmount.toLocaleString('sv-SE')} SEK kan erläggas under en period på ${data.earnoutPeriod} baserat på Bolagets prestation.

4.2 Prestationsmål

Tilläggsköpeskillingen baseras på följande KPI: ${data.earnoutKPI}

4.3 Beräkningsmetod

Köparen ska årligen rapportera utfallen av KPI-mål. Om målnivåerna uppfylls erlägger Köparen motsvarande earn-out enligt överenskommen modell.

4.4 Begränsningar

Köparen ska driva Bolaget i normala former. Köparen får inte avsiktligt påverka resultatet negativt för att undvika earn-out-betalning.`)

      if (doc.y > 700) doc.addPage()
    }

    // ===== SECTION 5: VILLKOR FÖR TILLTRÄDET =====
    createSectionHeader(doc, 'Villkor för tillträdet (Conditions Precedent)', 5)
    
    createParagraph(doc, `5.1 Villkor från Säljaren

a) Samtycke från övriga aktieägare (om applicable) har erhållits för överlåtelsen.

b) Bolagsordningen saknar förbehål mot överlåtelsen.

5.2 Villkor från Köparen

a) Köparen har genomfört en tillfredställande due diligence-granskning av Bolaget.

b) Inga väsentliga negativa förändringar i Bolagets verksamhet eller finansiella ställning har uppstått.

5.3 Långstoppdatum

Om villkoren inte är uppfyllda senast ${new Date(data.closingDate).toLocaleDateString('sv-SE')} kan part som villkoret rör häva sina skyldigheter.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 6: DUE DILIGENCE =====
    createSectionHeader(doc, 'Due Diligence (Företagsbesiktning)', 6)
    
    createParagraph(doc, `6.1 Genomförd due diligence

Köparen bekräftar att Köparen före detta Avtals undertecknande har genomfört en tillfredställande due diligence-granskning av Bolaget och dess verksamhet, och att Köparen haft möjlighet att ställa de frågor Köparen önskat.

6.2 Känd information

Säljaren ansvarar inte för sådana fel eller brister som Köparen kände till eller borde ha uppdagat vid sin due diligence-granskning före Avtalet undertecknades.

6.3 Informationsmaterial

All information som lämnats av Säljaren till Köparen under due diligence-processen, inklusive finansiella rapporter, kontrakt och övrig dokumentation, anses utgöra en del av denna överenskommelse genom referens.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 7: GARANTIER =====
    createSectionHeader(doc, 'Garantier från säljaren (Warranty)', 7)
    
    createParagraph(doc, `Säljaren garanterar följande:

7.1 Äganderätt till aktierna

Säljaren äger Aktierna i sin helhet, de är fullt betalda och oreglerade från belastningar, pantsättningar eller andra tredje-manspåstår.

7.2 Bolagets juridiska status

Bolaget är lagligen bildat enligt svensk lag, är aktivt registrerat hos Bolagsverket, och följer aktiebolagslagen (2005:551) och sin bolagsordning.

7.3 Finansiella garantier

a) Bolagets senaste bokslut är upprättat enligt god redovisningssed och ger en rättvisande bild av Bolagets finansiella ställning.

b) Inga dolda skulder eller åtaganden existerar utöver vad som framgår av de lämnade bokslutshandlingarna.

c) Samtliga skatter, arbetsgivaravgifter och myndighetsavgifter är betalade.

7.4 Avtal och åtaganden

Bolaget överensstämmer med sina väsentliga avtal. Inga väsentliga kontraktsbrott hotar. Inga ovanliga åtaganden såsom borgensförbindelser existerar utan Köparens vetskap.

7.5 Immateriella rättigheter

Bolaget äger eller licensierar de immateriella rättigheter (varumärken, patent, upphovsrätt) som är nödvändiga för dess verksamhet.

7.6 Personal

Alla anställningsavtal är upprättade skriftligen. Inga tvister med anställda föreligger. Inga ovanliga bonus-, lön- eller pensionsutfästelser existerar utöver vad som lämnats till Köparen.

7.7 Regelefterlevnad

Bolaget följer tillämpliga lagar och regler (miljölagstiftning, GDPR, arbetsmiljölagstiftning, etc.) och innehar nödvändiga tillstånd för sin verksamhet.

7.8 Inga tvister

Bolaget är inte inblandat i några tvister, rättegångar eller administrativa förfaranden.

7.9 Ingen väsentlig negativ förändring

Mellan Avtalet och Tillträdesdagen drivs Bolaget i sedvanlig ordning och ingen väsentlig negativ förändring har inträffat.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 8: ANSVAR OCH ANSVARSBEGRÄNSNINGAR =====
    createSectionHeader(doc, 'Ansvar och ansvarsbegränsningar', 8)
    
    createParagraph(doc, `8.1 Påföljder vid garantiavvikelse

Om en lämnad garanti visar sig felaktig har Köparen rätt till skälig kompensation genom:

a) Nedsättning av köpeskillingen, eller
b) Skadestånd motsvarande direkt skada för Köparen.

Köparen kan inte häva Avtalet på grund av garantiavvikelse efter Tillträdesdagen.

8.2 "Befintligt skick" (As Is)

Bolaget köps i befintligt skick. Säljaren friskriver sig från ansvar för fel eller brister som inte uttryckligen omfattas av garantierna i Avsnitt 7.

8.3 Tidsbegränsning (Basket och Cap)

a) Reklamationstid: Köparen måste framställa anspråk för garantifel inom 18 månader från Tillträdesdagen, annars förfaller rätten.

b) De Minimis-tröskel: Anspråk under 50 000 SEK räknas inte.

c) Cap: Säljarens totala ansvar för garantifel begränsas till 30% av köpeskillingen, dock högst 3 000 000 SEK.

8.4 Känd information

Säljaren ansvarar inte för fel som Köparen kände till eller borde uppdagat före Tillträdesdagen.

8.5 Köparens garantier

Köparen garanterar:

a) Köparen har befogenhet att underteckna och genomföra detta Avtal.

b) Köparen kommer att erlägga köpeskillingen i enlighet med avtalet.

c) Köpet kräver inte ytterligare godkännanden från myndigheterna eller tredje man.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 9: SEKRETESS OCH KONKURRENSFÖRBUD =====
    createSectionHeader(doc, 'Sekretess och konkurrensförbud', 9)
    
    createParagraph(doc, `9.1 Sekretess

Parterna är överens om att all konfidentiell information som erhållits i samband med detta Avtal hålls hemlig och inte sprids till utomstående utan den andra partens skriftliga samtycke.

Sekretessförpliktelsen gäller under obestämd tid för affärshemligheter och fram till publiceringen av informationen för övrigt.

9.2 Konkurrensförbud

Säljaren åtar sig att under en tid av 2 år från Tillträdesdagen varken direkt eller indirekt bedriva verksamhet som konkurrerar med Bolagets verksamhet på den svenska marknaden.

9.3 Värvningsförbud (Non-Solicitation)

Säljaren förbindes att under samma 2-årsperiod inte värva eller försöka värva Bolagets anställda eller kunder för egen verksamhet.

9.4 Vite

Vid brott mot konkurrens- eller värvningsförbudet ska Säljaren betala ett konventionalvite på 100 000 SEK per månad av överträdelsen.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 10: TVISTLÖSNING =====
    createSectionHeader(doc, 'Tvistlösning', 10)
    
    createParagraph(doc, `10.1 Tillämplig lag

Detta Avtal tolkas och tillämpas enligt svensk rätt, utan hinder av lagvalsprincipers regler.

10.2 Tvistlösningsförfarande

Eventuella tvister mellan parterna med anledning av detta Avtal ska i första hand sökas lösas genom förhandling mellan parterna.

Om parterna inte kan komma överens ska tvisten avgöras av Stockholms Tingsrätt som första instans.

10.3 Språk

Avtalet är upprättat på svenska, vilken version ska gälla vid eventuell konflikt.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 11: AVSLUTSFÖRFARANDE (CLOSING) =====
    createSectionHeader(doc, 'Avslutsförfarande (Closing-procedur)', 11)
    
    createParagraph(doc, `11.1 Tillträdesdag

Tillträdet (Closing) äger rum på Tillträdesdagen: ${new Date(data.closingDate).toLocaleDateString('sv-SE')}

11.2 Leverabler vid tillträdet

Vid Tillträdet ska följande åtgärder genomföras:

a) Säljaren överlämnar aktiebevis (eller motsvarande överlåtelsehandling).

b) Aktieboken uppdateras med Köparen som ny ägare.

c) Köparen överför köpeskillingen enligt Avsnitt 3.

d) En bolagsstämma hålls där Säljaren (som siste ägare) beslutar om ny styrelse enligt Köparens önskemål.

e) Styrelseprotokoll undertecknas.

f) Kvitto på mottagning av betalning utväxlas.

11.3 Registreringar efter closing

Efter Tillträdet ansvarar Köparen för att anmäla:

a) Ny styrelse och revisor till Bolagsverket.

b) Uppdateringar av aktieboken.

c) Övriga ändringar i Bolagsverket enligt lag.

11.4 Closing-checklista

En detaljerad checklista över alla åtgärder vid Closing bifogas denna Avtal som Bilaga A.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 12: ÖVRIGA BESTÄMMELSER =====
    createSectionHeader(doc, 'Övriga bestämmelser', 12)
    
    createParagraph(doc, `12.1 Fullständigt avtal

Detta Avtal utgör parternas hela överenskommelse gällande föremålet. Tidigare utkast, avsiktsförklaringar (Letter of Intent) och muntliga löften ersätts och är inte längre gällande.

12.2 Ändringar

Ändringar av detta Avtal måste göras skriftligen och undertecknas av båda parter för att vara giltiga.

12.3 Kostnadsbörda

Vardera part bär sina egna kostnader för juridisk rådgivning, revisorer och andra rådgivare i samband med detta Avtal och dess genomförande.

12.4 Separabilitetsklausul

Om någon bestämmelse i detta Avtal skulle visat sig ogiltig eller icke-tillämplighär påverkar det inte giltigheten eller tillämpligheten av övriga bestämmelser.

12.5 Meddelanden

Formella meddelanden mellan parterna ska ske skriftligen och anses mottagits 3 arbetsdagar efter avsändandet.

12.6 Överlåtelse

Ingen part får överlåta sina rättigheter eller skyldigheter enligt detta Avtal utan den andra partens skriftliga samtycke.

12.7 Kostnader och stämpelskatt

Köparen ansvarar för eventuella registreringsavgifter eller övriga administrativa kostnader relaterade till aktieöverlåtelsen.

Vid aktieöverlåtelse förekommer ingen stämpelskatt enligt gällande svensk lag.`)

    if (doc.y > 700) doc.addPage()

    // ===== SECTION 13: UNDERTECKNINGAR =====
    doc.fontSize(14).font('Helvetica-Bold').text('13. Underteckningar', { underline: true })
    doc.moveDown(1)

    doc.fontSize(11).font('Helvetica').text('HÄRIGENOM bestyrka vi att vi läst och förstått detta Avtal och att vi går in på dess villkor.', { align: 'justify' })
    doc.moveDown(2)

    doc.fontSize(11).font('Helvetica-Bold').text('SÄLJARE:')
    doc.moveDown(2)
    doc.text('_' . repeat(40))
    doc.moveDown(0.5)
    doc.text(data.sellerName)
    doc.moveDown(0.5)
    doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)

    doc.moveDown(3)

    doc.fontSize(11).font('Helvetica-Bold').text('KÖPARE:')
    doc.moveDown(2)
    doc.text('_' . repeat(40))
    doc.moveDown(0.5)
    doc.text(data.buyerName)
    doc.moveDown(0.5)
    doc.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`)

    doc.moveDown(3)

    doc.fontSize(9).font('Helvetica').text('_______________________________________________')
    doc.text('Detta dokument är juridiskt bindande. Båda parter rekommenderas att söka juridisk rådgivning innan undertecknande.')

    // Finalize
    doc.end()
  })
}
