import fastf1


session = fastf1.get_session(2018, 'china', 'Q')
session.load()

circuit_info = session.get_circuit_info()

print(circuit_info)