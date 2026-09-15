// ---------------------------------------------------------------------------
// Passeport Formation Pharmaciens — Réception des inscriptions
// Google Apps Script : écrit la ligne dans Google Sheets + envoi d'un email
//
// MISE EN PLACE (à faire une seule fois, par le propriétaire du compte Google) :
//   1. Créez un Google Sheet vierge : https://sheets.new
//   2. Renommez l'onglet en "Inscriptions" (ou changez SHEET_NAME ci-dessous).
//   3. Dans la feuille : Extensions > Apps Script.
//   4. Supprimez le code par défaut et collez ce fichier à la place.
//   5. Remplacez EMAIL_TO par l'adresse qui doit recevoir les inscriptions.
//   6. Déployez : Déployer > Nouveau déploiement > Application Web
//        - Exécuter en tant que : Moi
//        - Qui a accès : Tous les utilisateurs (anonyme)
//      Note : la 1re autorisation demande de vérifier que vous êtes le
//      propriétaire (avancé > Accéder à "nomduprojet").
//   7. Copiez "URL Web" du déploiement et collez-la dans src/App.tsx
//      à la constante APPS_SCRIPT_URL.
// ---------------------------------------------------------------------------

const SHEET_NAME = 'Inscriptions'
const EMAIL_TO = 'ADRESSE_A_REMPLACER@exemple.com'

function doGet() {
  try {
    var res = { ok: true, message: 'Apps Script opérationnel. POST = enregistrement Sheet + email.', email: EMAIL_TO }
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    if (ss) {
      res.feuille = ss.getName()
      res.url = ss.getUrl()
      var ws = ss.getSheetByName(SHEET_NAME)
      res.onglet = ws ? ws.getSheetName() : 'introuvable (créée au prochain envoi)'
      res.derniereLigne = ws ? ws.getLastRow() : 0
    } else {
      res.error = 'Aucune feuille liée : le script doit être créé depuis Extensions > Apps Script dans la feuille concernée.'
    }
    return jsonResponse(res)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) })
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}')

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let ws = ss.getSheetByName(SHEET_NAME)
    if (!ws) {
      ws = ss.insertSheet(SHEET_NAME)
    }

    if (ws.getLastRow() === 0) {
      ws.appendRow([
        'Horodatage', 'Prénom', 'Nom', 'Téléphone', 'Pharmacie / faculté', 'Ville',
        'Ateliers', 'Formule', 'Total (DH)', 'Nombre d\'ateliers',
      ])
    }

    ws.appendRow([
      new Date(),
      data.prenom || '',
      data.nom || '',
      data.tel || '',
      data.pharma || '',
      data.ville || '',
      (data.ateliers || []).map(fmtAtelier).join('\n'),
      data.formule || '',
      data.total || '',
      data.nbAteliers || '',
    ])

    if (EMAIL_TO && !EMAIL_TO.startsWith('ADRESSE_A_REMPLACER')) {
      const sujet = 'Nouvelle inscription Passeport Formation — ' + data.prenom + ' ' + data.nom
      const corps = [
        'Bonjour,',
        '',
        'Une nouvelle demande d\'inscription vient d\'arriver :',
        '',
        'Prénom : ' + data.prenom,
        'Nom : ' + data.nom,
        'Téléphone : ' + data.tel,
        'Pharmacie / faculté : ' + data.pharma,
        'Ville : ' + data.ville,
        '',
        'Ateliers :',
        (data.ateliers || []).map(function (a) { return '- ' + fmtAtelier(a) }).join('\n'),
        '',
        'Formule : ' + data.formule,
        'Total à régler : ' + data.total + ' DH',
        '',
        'La ligne a également été ajoutée à la Google Sheet.',
      ].join('\n')
      MailApp.sendEmail(EMAIL_TO, sujet, corps)
    }

    return jsonResponse({ ok: true, feuille: ss.getName(), url: ss.getUrl(), onglet: ws.getSheetName() })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) })
  }
}

function fmtAtelier(a) {
  var d = a.date ? ', ' + a.date : ''
  return a.titre + ' (' + a.format + d + ') : ' + a.prix + ' DH'
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}