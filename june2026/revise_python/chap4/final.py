grades = [80, 90, 70, 100, 95]

def average(grades):
    return sum(grades) / len(grades) 

def highest(grades):
    return max(grades)

def lowest(grades):
    return min(grades)     

print(f"La moyenne est : {average(grades)}")
print(f"La plus grande note est: {highest(grades)}")
print(f"La plus petite note est: {lowest(grades)}")     