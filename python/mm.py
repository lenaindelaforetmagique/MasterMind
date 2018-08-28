#!/usr/bin/env python
#-*- coding: utf-8 -*-

# MasterMind Game

from random import *
from time import *
import pickle
import os.path

## ----------------------------------------------------------------------------
COLORS = "ABCDEF"
LENGTH = 4
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
    """Returns all possible combinations:
    colors: str of authorized letters/colors
    length: int representing the length of a combination"""

    global COLORS, LENGTH
    fileName = "{}_{}.dat".format(COLORS, LENGTH)

    if os.path.isfile(fileName):
        # load file
        print(" .. opening {}".format(fileName))
        file = open(fileName, 'rb')
        res = pickle.load(file)
        file.close()       
    else:
        # job        
        nCol = len(COLORS)
        res = set()
        for i in range(nCol**LENGTH):
            comb = ""
            k = i
            while k > 0 or len(comb) < LENGTH:
                comb += COLORS[k%nCol]
                k//=nCol
            res.add(comb)
        # save file
        print(" .. saving {}".format(fileName))
        file = open(fileName, 'wb')
        pickle.dump(res, file)
        file.close()
    
    return res


def generateAllNeighbours():
    """Generates a dictionary {key:combination;value:dictionary(key:note;value:set(combinations))} where:
    note is a tuple (a,b)
    set() is a set containing all neighbours that would have the same note"""
    global COLORS, LENGTH, UNIVERSE
    fileName = "{}_{}_n.dat".format(COLORS, LENGTH)
    
    if os.path.isfile(fileName):
        # load file
        print(" .. opening {}".format(fileName))
        file = open(fileName, 'rb')
        res = pickle.load(file)
        file.close()
    else:
        # job
        res = {}
        for id in UNIVERSE:
            res[id] = {}
            for idn in UNIVERSE:
                score = strComp(id, idn)
                if score not in res[id].keys():
                    res[id][score] = set()
                res[id][score].add(idn)
        # save file
        print(" .. saving {}".format(fileName))
        file = open(fileName, 'wb')
        pickle.dump(res, file)
        file.close()
    return res
    
## ----------------------------------------------------------------------------

def evaluateProposition(prop, reste):
    """Calculates the average size after playing _prop_
    reste: combinations that may solve the problem
    """
    global NB_COMB, NEIGHBOURS
    res = 0
    for note in NEIGHBOURS[prop].keys():
        proba = len(NEIGHBOURS[prop][note])/NB_COMB
        res += proba*len(reste.intersection(NEIGHBOURS[prop][note]))
    return int(res)


def bestProposition(reste):
    """Returns the best proposition that minimize the size of residual possibilities
    """
    global COLORS, LENGTH
    min = len(COLORS)**LENGTH
    sol = []
    for prop in reste:
        val = evaluateProposition(prop, reste)
        if val == min:
            sol.append(prop)
        elif val < min:
            min = val
            sol = []
            sol.append(prop)
    return sol

## ----------------------------------------------------------------------------

def NewGame(solution = None):
    """Launches a new game.
    solution(None): if specified, the program works alone, otherwise the user has to note each try
    """
    global COLORS, LENGTH, UNIVERSE
    
    print("\n*** MASTER MIND ***\n")
    
    if solution is None:
        print("Choisis une combinaison à {} couleurs parmi les suivantes {}".format(LENGTH, COLORS))
        input("Quand tu es pret, tape Entree")
        
    possibilities = UNIVERSE
    notFound = True
    noError = True
    cpt = 0
    while notFound and noError:
        print("---")
        cpt += 1
        options = bestProposition(possibilities)
        if len(options)>0 and len(possibilities)>0:
            print("Coup #{} -- ({}/{})".format(cpt, len(options), len(possibilities)))
            choix = choice(list(options))

            print("Je joue {}".format(choix))
            if solution is None:          
                a = int(input("Combien de bien placés ?"))
                if a < LENGTH-1:
                    b = int(input("Combien de mal placés ?"))
                else:
                    b = 0
                note = (a, b)
            else:
                note = strComp(solution, choix)
                print(note)
                
            if note == (LENGTH, 0):
                notFound = False
            else:
                possibilities = possibilities.intersection(NEIGHBOURS[choix][note])
        else:
            print("Arf, je n'arrive pas à trouver ! ")
            noError = False
            
    if noError:
        print("\nAhah, j'ai trouve en {} coups !!".format(cpt))
        print("Pour jouer à nouveau, tape 'NewGame()'")

    if solution is not None:
        return noError


## ----------------------------------------------------------------------------

def test():
    """(obsolete) A lot of tries to check program"""
    global UNIVERSE
    listeUnivers = list(UNIVERSE)
    listeUnivers.sort()
    i = 0
    while NewGame(choice(listeUnivers)):
        i+=1
        print(i)
        

## ----------------------------------------------------------------------------

t0 = time()
print("Chargement ...")
UNIVERSE = generateUniverse()
NB_COMB = len(UNIVERSE)
NEIGHBOURS = generateAllNeighbours()
print(" ... fait en {:.3} s".format(time()-t0))


NewGame()




