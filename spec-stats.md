Let's add some learning stats.

Track on the SD, per flashcard, a bitstring with its correct/wrong trials (just 0=wrong, 1=correct).
on the web manager, show this as tiny red/green square boxes (unlabeled, w/o fancieness) in a row, on the flashcards.

Save true timestamp on the SD whenever device is synced w/ manager.
Also track sessions (esp being on between restarts/power cycles), and how many cards were practiced during these sessions.
Add a stats page to the manager, accessible via the header.

On it, show a bar chart w/ how many cards practiced per session, but also within this chart show in which date range these sessions were (since we don't know exact datetime, only the sync datetimes).
Move the "how many cards in which boxes" info from current manager main page to stats also, and add as a bar chart. Use a proper library for the charts.

Stick to relevant CLAUDE.md files. Reflash device when done.
