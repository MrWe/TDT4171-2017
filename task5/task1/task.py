import matplotlib.pyplot as plt
import numpy as np
import math as math




W = []

def createW():
  for i in range(-6,7):
    for j in range(-6,7):
      W.append([i,j])


createW()


def delta(w, x):
  return 1 if (1/(1+math.e**(-(w**2) * x))) > 0.5 else 0;


def loss(w):
  pass

#print(delta(0,0));


plt.plot(W, 'ro')
plt.axis([-20, 200, -10, 10])
plt.show()
'''
t = delta(-6,6)
s = delta(0,0)
s = 1 + np.sin(2*np.pi*t)


plt.xlabel('x')
plt.ylabel('y')
#plt.title('About as simple as it gets, folks')
plt.grid(True)
#plt.savefig("test.png")

'''
