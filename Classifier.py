import csv
import math
import itertools
import random
from collections import defaultdict
flowerDict = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
correctCount = 0
def classify(f1, f2, f3, f4, C):
    probabilitySetosa = 0.0
    probabilityVersicolor = 0.0
    probabilityVirginica = 0.0
    smoothing = .001
    probabilitySetosa = (math.log(1/3) + (math.log((flowerDict['Setosa'][0][f1] + smoothing)/50)) + (math.log((flowerDict['Setosa'][1][f2] + smoothing)/50)) + (math.log((flowerDict['Setosa'][2][f3] + smoothing)/50)) + (math.log((flowerDict['Setosa'][3][f4] + smoothing)/50)))
    probabilityVersicolor = (math.log(1/3) + (math.log((flowerDict['Versicolor'][0][f1] + smoothing)/50)) + (math.log((flowerDict['Versicolor'][1][f2] + smoothing)/50)) + (math.log((flowerDict['Versicolor'][2][f3] + smoothing)/50)) + (math.log((flowerDict['Versicolor'][3][f4] + smoothing)/50)))
    probabilityVirginica = (math.log(1/3) + (math.log((flowerDict['Virginica'][0][f1] + smoothing)/50)) + (math.log((flowerDict['Virginica'][1][f2] + smoothing)/50)) + (math.log((flowerDict['Virginica'][2][f3] + smoothing)/50)) + (math.log((flowerDict['Virginica'][3][f4] + smoothing)/50)))
    if (probabilitySetosa > probabilityVersicolor and probabilitySetosa > probabilityVirginica):
        prediction = 'Setosa'
    elif (probabilityVersicolor > probabilitySetosa and probabilityVersicolor > probabilityVirginica):
        prediction = "Versicolor"
    else:
        prediction = "Virginica"
    if (prediction == C):
        print('Predicted Class: ' + prediction + ' | Actual Class: ' + C + ' | Result: Correct')
        global correctCount
        correctCount += 1
    else:
        print('Predicted Class: ' + prediction + ' | Actual Class: ' + C + ' | Result: Incorrect')

def main():
    #training data
    noRepeat = []
    with open('iris.csv') as csvfile:
        readIris = csv.reader(csvfile, delimiter=',')
        while (len(noRepeat) < 75):
            with open('iris.csv') as csvfile:
                readIris = csv.reader(csvfile, delimiter=',')
                randNum = random.randint(0,150)
                if randNum not in noRepeat:
                    noRepeat.append(randNum)
                    for row in itertools.islice(readIris,randNum,randNum+1):
                        for x in range(4):
                            flowerDict[row[4]][x][row[x]] += 1
                            #[class][feature][value]
        
    #to be fed data
    with open('iris.csv') as csvfile:
        readIris = csv.reader(csvfile, delimiter=',')
        while (len(noRepeat) < 150):
            with open('iris.csv') as csvfile:
                readIris = csv.reader(csvfile, delimiter=',')
                randNum = random.randint(0,150)
                if randNum not in noRepeat:
                   noRepeat.append(randNum)
                   for row in itertools.islice(readIris,randNum,randNum+1): 
                        classify(row[0], row[1], row[2], row[3], row[4])
                        #[sepal-length][sepal-width][petal-length][petal-width]
    correctPercent = (correctCount/75)*100
    print(correctPercent)
if __name__=='__main__':
    main()