This is a REST API for nihongoresources.com, so that I can
start weening that off of PHP.

Searching currently allows for three routes:

>  /entry/:id

to get an entry's JSON readout by numerical id (based on the JMdict sequence number)

>  /find/:term

performs a search for all entries matching that term (language autodetected) and returns JSON

>  /show/:term

same as find, but returns styled and out-linking HTML for easy inspection.

Temporarily running over at http://therealpomax.com, this will
be accessibly "for reals" on http://api.nihongoresources.com
