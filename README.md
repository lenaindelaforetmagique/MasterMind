# MasterMind Solver
----

MasterMind Solver est un programme qui permet de trouver la solution d'une combinaison cachée du MasterMind.


## Algorithme mis en oeuvre
### Vocabulaire
Univers = Ensemble des combinaisons de lettres possibles (dans l'absolu)
Possibilites = Ensemble des combinaisons encore possible (au cours du jeu)
Voisins = Ensemble des combinaisons compatibles avec une note
        = Dictionary{key:Combinaison ; values:Dictionary{key:note ; values:Combinaisons}}


### Effet d'un coup
À chaque coup noté, on peut associer un ensemble de possibilités compatibles (voisins).
L'ensemble des possibilités est alors réduit à Intersection(Possibilités, voisins).

### Choix d'un coup
On balaie l'ensemble des possibilités (proposition). Proposition que l'on note.
Note de proposition = taille moyenne des Possibilités après ce coup

On choisit le coup qui permet la plus grande réduction
