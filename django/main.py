# import time
# import datetime
# s = "2021-04-05"
# time.mktime(datetime.datetime.strptime(s, "%Y-%m-%d").timetuple())
# print(time)

import datetime
stime = "2021-04-05T02:13:40"
print(datetime.datetime.strptime(stime, "%Y-%m-%dT%H:%M:%S").timestamp())
