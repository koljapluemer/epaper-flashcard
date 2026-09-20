let's make a cooler page for when the ESP is turned off (currently it just says "Bye").

- add a page to the web manager, accessible via header nav: "Settings". Here, in an input, user can set a welcomeMessage. This is dithered in the usual way, and should become the first 32 rows full width on the turned off screen.
- below that, show either "No stats yet. Turn on and get started" as a default setting for new users, or show some stats:

```
You practiced $n times # number of trials in the last session before turn off
----- # full width separator line
Boxes:
Unpracticed: $x
Box 0: $y
... # show 5 boxes at most
```

