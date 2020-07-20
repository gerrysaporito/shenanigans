# Text Spammer - A script to spam posts.

"""
WARNING: I'm not responsible for any damage that may happen to your account! Proceed at your own risk!
Author: Gerry Saporito
Built with: PYTHON 3.6.7
github: ??
"""

import time
import math
import fbchat 
from fbchat.models import *
from getpass import getpass 

# Ask user for message and spam count
print("WARNING: I'm not responsible for any damage that may happen to your account! Proceed at your own risk!\n" +
	"To be on the safe side make a fake account for sites like FB.")
print("-" * 100)

interval, duration, count = 0, 0, 0
message, audience, thread = "", "", ""
target_id = ""
client = {}
failed = True

while failed == True:
	try:
		username = str(input("Enter your Facebook Messenger username or email: ")) 
		client = fbchat.Client(username, getpass())
		failed = False
	except:
		print("Incorrect username or password. Please try again.")
failed = True

while failed == True:
	try:
		name = input("Please input the name of the group chat:")
		thread = client.searchForGroups(name, limit=100)[0].uid
		failed = False
	except:
		print("Incorrect group chat name: " + name)

# message = input("Message (leave empty for default message): ")

if message == "":
	message = "Hey summoners!!! This is a friendly reminder: the next time we will be on the rift will be in approximately %d hrs."

while interval <= 0:
	interval = int(input("Time interval (minutes): "))
	if interval <= 0:
		print("Sorry, please choose a number larger than 0.")

while duration <= interval:
	duration = int(input("Duration (minutes): "))
	if duration < interval:
		print("Sorry, please choose a number larger than your interval of: " + str(interval))

print("-" * 100)
print("Starting to send out messages now")
print("-" * 100)

while duration > 0:
	hrs = math.floor(duration/60)
	mins = math.ceil(duration%60)
	message = "Hey summoners!!! This is a friendly reminder: the next time we will be on the rift will be in approximately {} hr(s) and {} min(s).".format(hrs, mins)
	count += 1
	client.send(Message(text=message), thread_id=thread, thread_type=ThreadType.GROUP)
	print(str(count) + " message(s) have been sent successfully! There are " + str(duration) + " minute(s) left.")
	duration -= interval
	time.sleep(interval*60)

print("Finished sending all messages. Thanks again for using this script!")
client.logout()
