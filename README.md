This is a REST API for nihongoresources.com, so that I can
start weening that off of PHP.

Searching currently allows for three routes:

>  /:context/entry/:id

to get an entry's JSON readout by primary identifier (this value is *context* dependent)

>  /:context/find/:term

performs a search for all entries matching that term (language autodetected) and returns JSON

>  /:context/show/:term

same as find, but returns styled and out-linking HTML for easy inspection.

Available *context*s are:

1. `dict` for the jp <-> en dictionary
2. `kanji` for the kanji dictionary
3. `name` for the names dictionary
4. `sfx` for the giongo/gitaigo dictionary

Temporarily running over at http://therealpomax.com, this will
be accessibly "for reals" on http://api.nihongoresources.com
