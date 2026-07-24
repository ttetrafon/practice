# Markov Chain

you could use a markov chain to do this, input giant list of names, and figure out which letter is likely to come after the previous letter

- alex
- frank
- alan
{a: [l,l,n], l: [e,a], e: [x], f : [r],  r:[a], n:[k] }

'lank' is a unique name that can be made with these three names, they usually get better the larger the input list, then you can figure out n-gram values where you take sample sizes larger then 1 character

- alex
{a: [le]. l: [ex]}

---

Make sure that you count the name ending as one of the options in your dictionary. It makes names tend to end in a normal sounding way.

Filter out results that are too short, have too few vowels for the length or have too many consonants in a row.

Try out bigrams and trigrams and see what strikes the balance between creative and normal sounding.

I added a layer of complexity which really helped the results even if I can't figure out why. The program first selected 12 random letters (with a certain amount of vowels) and then the markov chain was restricted to only using those 12 letters for each name. Worked like magic for some reason.
