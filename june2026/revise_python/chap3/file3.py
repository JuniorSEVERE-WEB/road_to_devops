age = int(input("Type your age: "))

carte_etudiant = input("Are you a student? (true/false): ").strip().lower()

if age < 18 and carte_etudiant == "true":
    print("Reduction accordee")
else:
    print("Prix normal")
    