#!/usr/bin/env python
#-*- coding: utf-8 -*-

# MasterMind Game

from random import *
from time import *



## ----------------------------------------------------------------------------

def strComp(s1, s2):
    """Compares string1 vs string2
    returns a tuple (a, b)
    a = number of common caracters at the same position
    b = number of common caracters at different position
    """
    a, b = 0, 0

    ## Count of common caracters at the same position
    i = 0
    while i < len(s1) and i < len(s2):
        if s1[i] == s2[i]:
            a += 1
            s1 = s1[:i] + s1[i+1:]
            s2 = s2[:i] + s2[i+1:]
        else:
            i += 1

    ## Count of common caracters at different position
    i = 0
    while i < len(s1) and i < len(s2):
        j = s2.find(s1[i])
        if j != -1:
            b += 1
            s1 = s1[:i] + s1[i+1:]
            s2 = s2[:j] + s2[j+1:]
        else:
            i += 1

    return (a, b)


# def dvlpComb(s, note):
#     """Develops combinations that are compatible with note(a,b)
#     returns a set containing strings
#     """
#     result = set()
#     for a_pos in k_parmi_n(a, n):
#         for b_pos in k_parmi_n(b, n-a):
#             a = 1
#
#
#     return result


## -------------------------------

def generateUniverse():
    """Returns all possible combinations in a range"""
    global COLORS
    nCol = len(COLORS)
    # res = []
    res = set()
    for i in range(nCol**4):
        comb = ""
        k = i
        while k > 0 or len(comb) < 4:
            comb += COLORS[k%nCol]
            k//=nCol
        # res.append(comb)
        res.add(comb)
    return res

def generateAllNotes():
    """Generates a dictionary containing all the notes and their probability"""
    global UNIVERSE
    res = {}
    for sol in UNIVERSE:
        for prop in UNIVERSE:
            score = strComp(sol, prop)
            if score not in res.keys():
                res[score] = 0
            res[score] += 1
    nb = len(UNIVERSE)
    for key in res.keys():
        res[key] /=nb**2

    return res


def generateAllNeighbours():
    """Generates a dictionary {key:dictionary(note:set())} where:
    note is a tuple (a,b)
    set() is a set containing all neighbours that would have the same note"""
    global UNIVERSE
    res = {}
    for id in UNIVERSE:
        res[id] = {}
        for idn in UNIVERSE:
            score = strComp(id, idn)
            if score not in res[id].keys():
                res[id][score] = set()
            res[id][score].add(idn)
    return res

# def statOnNotes(dic):
#     """Generates a dictionary of probabilities for each note based on _dic_
#     dic:{key:dictionary(note:set())}
#     key: tuple (a,b)
#     values: probability
#     """
#     res = {}
#     cpt = 0
#     for id in dic.keys():
#         for score in dic[id].keys():
#             if score not in res.keys():
#                 res[score] = 0
#             nb = len(dic[id][score])
#             cpt += nb
#             res[score] += nb
#     for key in res.keys():
#         res[key] /= cpt
#     return res


## ----------------------------------------------------------------------------

def noteProposition(prop, reste):
    """Calculates the average size  after playing _prop_
    reste: combinations that may solve the problem
    """
    global NB_COMB, VOISINS
    res = 0
    for note in VOISINS[prop].keys():
        proba = len(VOISINS[prop][note])/NB_COMB
        res += proba*len(reste.intersection(VOISINS[prop][note]))
    return res

def bestProposition(reste):
    """Returns the best proposition that minimize the size of residual possibilities
    """
    min = len(COLORS)**4
    sol = []
    for prop in reste:
        val = int(noteProposition(prop, reste))
        if val == min:
            sol.append(prop)
        elif val < min:
            min = val
            sol = []
            sol.append(prop)
    return sol

## ----------------------------------------------------------------------------
def nbCoups(solution):
    """Retourne le nombre de coups nécessaires pour trouver la solution"""
    global UNIVERSE, VOISINS
    cpt = 0
    possibilities = UNIVERSE
    note = None
    while note != (4, 0):
        options = bestProposition(possibilities)
        choix = choice(list(options))
        note = strComp(solution, choix)
        # print(choix, note)
        cpt += 1
        possibilities = possibilities.intersection(VOISINS[choix][note])
    # print("** BRAVO, trouvé en {} coups".format(cpt))
    return cpt

def calculeTout():
    """Retourne le nombre de cas trouvés par nombre de coups
    """
    dicoNBcoups = {}
    # solution = choice(list(UNIVERSE))
    for solution in UNIVERSE:
        nb = nbCoups(solution)
        if nb not in dicoNBcoups.keys():
            dicoNBcoups[nb] = 0
            dicoNBcoups[nb] += 1
    print(dicoNBcoups)


## ----------------------------------------------------------------------------
t0 = time()
print("Chargement ...")
COLORS = "ABCDEF"
UNIVERSE = generateUniverse()
NB_COMB = len(UNIVERSE)
VOISINS = generateAllNeighbours()
print(" ... fait en {:.3} s".format(time()-t0))


## ----------------------------------------------------------------------------

def NouvellePartie(solution = None):
    print("\n*** MASTER MIND ***\n")
    if solution is None:
        print("Choisis une combinaison constituee des couleurs suivantes {}".format(COLORS))
        input("Quand tu es pret, tape Entree")
    pasTrouve = True
    pasErreur = True
    possibilities = UNIVERSE
    cpt = 0
    while pasTrouve and pasErreur:
        print("---")
        cpt += 1
        options = bestProposition(possibilities)
        if len(options)>0 and len(possibilities)>0:
            print("Coup #{} -- ({}/{})".format(cpt, len(options), len(possibilities)))
            choix = choice(list(options))

            print("Je joue {}".format(choix))
            if solution is None:          
                a = int(input("Combien de bien placés ?"))
                if a < 3:
                    b = int(input("Combien de mal placés ?"))
                else:
                    b = 0
                note = (a, b)
            else:
                note = strComp(solution, choix)
                print(note)
                
            if note == (4, 0):
                pasTrouve = False
            else:
                possibilities = possibilities.intersection(VOISINS[choix][note])
        else:
            print("Arf, je n'arrive pas à trouver ! ", solution)
            pasErreur = False
            
    if pasErreur:
        print("\nAhah, j'ai trouve en {} coups !!".format(cpt))
        print("Pour jouer à nouveau, tape 'NouvellePartie()'")

    return pasErreur
# ---------

NouvellePartie()


# ------------
def test():
    listeUnivers =list(UNIVERSE)
    listeUnivers.sort()
    i = 0
    while NouvellePartie(choice(listeUnivers)):
        i+=1
        print(i)
        
