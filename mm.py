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

## ----------------------------------------------------------------------------

def noteProposition(prop, reste):
    """Calculates the average size after playing _prop_
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
            print("Arf, je n'arrive pas à trouver ! ")
            pasErreur = False
            
    if pasErreur:
        print("\nAhah, j'ai trouve en {} coups !!".format(cpt))
        print("Pour jouer à nouveau, tape 'NouvellePartie()'")

    if solution is not None:
        return pasErreur


## ----------------------------------------------------------------------------

def test():
    listeUnivers = list(UNIVERSE)
    listeUnivers.sort()
    i = 0
    while NouvellePartie(choice(listeUnivers)):
        i+=1
        print(i)
        

## ----------------------------------------------------------------------------

def readLines(fileName):
    """Returns a table containing the lines in fileName, without '\n' at ending"""
    file = open(fileName,'r')
    Lines = file.readlines()
    file.close()
    result = []
    for line in Lines:
        result.append(line.replace('\n', ''))
    return result

## ----------------------------------------------------------------------------




t0 = time()
print("Chargement ...")
COLORS = "ABCDEFGH"
UNIVERSE = generateUniverse()
NB_COMB = len(UNIVERSE)
VOISINS = generateAllNeighbours()
print(" ... fait en {:.3} s".format(time()-t0))

##
##strU = ' '.join(UNIVERSE)
##strN = ' '.join(
##file = open(COLORS + ".dat", 'w')
##file.write(truc)
##file.write("\n")
##file.write("coucou")
##file.close()
##
##bdule = set(truc)
##print(type(bdule))
##print(bdule)
##

NouvellePartie()




