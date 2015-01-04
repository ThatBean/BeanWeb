#!/usr/bin/python

CGI_PLACE = '"/cgi-bin/CQUP.py"'

# Import modules for CGI handling
import cgi, os
import cgitb; cgitb.enable()

print "Content-type:text/html\r\n\r\n"
print """
<html>
<head>
<title>CQUP - CGI Query Uniprot Py</title>
</head>
<body>
<h1> Welcome to CQUP!</h1>
<h3> - CGI Query Uniprot Py -</h3>
</body>
"""

message_text = "<small>No Entered Uniprot Query</small>"

print """<fieldset>
<legend>Text Query</legend>
<form action=%s method="post">
<p><textarea name="query" cols="60" rows="4">
Enter the query here! Here is a sample query:
HLA class II histocompatibility antigen insulin
</textarea></p>
<p><input type="submit" value="Submit" />%s</p>
</form>
</fieldset>
""" % (CGI_PLACE,message_text)

print """
<fieldset>
<legend>File Query</legend>
<html>
<body>
<form enctype="multipart/form-data" action=%s method="post">
<p>File: <input type="file" name="filename" /></p>
<p><input type="submit" value="Upload" /><small>%s</small></p>
</form>
</body>
</html>
""" % (CGI_PLACE,message_file)

print "</html>"

