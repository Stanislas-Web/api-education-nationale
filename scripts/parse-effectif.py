import sys, json

d = json.load(sys.stdin)
print('success:', d['success'])
print('message:', d['message'])
print('anneePrecedente:', d.get('anneePrecedente'))
print('anneeActuelle:', d.get('anneeActuelle'))
print('isDefaultData:', d.get('isDefaultData'))
print()

data = d['data']
eff = data.get('effectifs', {})

print('--- Effectifs retournes ---')
pre = eff.get('niveauPrescolaire', {})
print('Prescolaire ECE:', pre.get('espaceCommunautaireEveil', {}))
print('Prescolaire Maternel:', pre.get('maternel', {}))
print('Prescolaire PrePrimaire:', pre.get('prePrimaire', {}))
print('Prescolaire Special:', pre.get('special', {}))

pri = eff.get('niveauPrimaire', {})
print('Primaire Special:', pri.get('enseignementSpecial', {}))
print('Primaire Normal:', pri.get('enseignementPrimaire', {}))

sec = eff.get('niveauSecondaire', {})
print('Secondaire Special:', sec.get('enseignementSpecial', {}))
ens_sec = sec.get('enseignementSecondaire', {})
print('7eCTEB:', ens_sec.get('septiemeCTEB', {}))
print('8eCTEB:', ens_sec.get('huitiemeCTEB', {}))
print('1eHumanite:', ens_sec.get('premiereHumanite', {}))
print('4eHumanite:', ens_sec.get('quatriemeHumanite', {}))
