import pyttsx3

text = input("Enter your text: ")

engine = pyttsx3.init()

engine.save_to_file(text, "output.wav")
engine.runAndWait()

print("Audio generated successfully!")
print("Saved as output.wav")