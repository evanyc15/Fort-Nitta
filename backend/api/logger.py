import datetime
import time


loggerFile = open('C:/Users/Himali/Documents/GitHub/ECS160Server/backend/api/server_log.txt', 'a')
def log(message):
    ts = time.time()
    ts = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    loggerFile.write("[" + ts + "] " + message + "\n")
    loggerFile.flush()