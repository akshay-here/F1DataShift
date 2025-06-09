import fastf1

session = fastf1.get_session(2018, "Singapore", "Q")
session.load()
print(session.results)
