Calvin Liu
804182525

I was able to create 2 different cubes with the camera navigation and different
textures. The texture I mapped onto the cube was a 2D image of the google
chrome icon which happens to be 512x512
I did the extra credits

To Compile:
Google chrome and other browser disable access to the image due to security
reasons so a local server or web server is needed
On a unix interface:
1.Change directory into the directory that contains the files
2.python -m SimpleHTTPServer
3.Open a browser and type http://127.0.0.1:8000/
4.Click the texture.html file
5.Keep the terminal window open to keep the webserver running on your local

Keyboard Inputs:
r - stops the rotation of the cubes
i - moves closer to the cubes
o - moves farther from the cubes
s - makes the texture scroll throughout the cube
t - makes the texture spin in the corner of the cube. Cannot get it to spin in the
center of the cube so far. 


Textures: The first cube has a texture that is not as smooth as the second cube 
to see the textures more easily.
The second cube does not have a scaled icon, it takes up the whole cube when mapped. 
