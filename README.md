# simple-sqlite-viewer README

A VSCode extension that lets you read SQLite `.db` files as plain text. Double-click a database file and its tables and rows are laid out in a readable, scrollable view.

## Features

Open any `.db` file from the Explorer and the extension reads the database, formats every table as aligned text, and shows it in an editor tab.

Each table is rendered with a banner, aligned columns separated by `|`, and dashed border lines:

```
=============
=  items    =
=============

---+----------------+----------+--------+----------
id | name           | quantity | price  | status_id
---+----------------+----------+--------+----------
1  | Widget         | 120      | 2.5    | 1
2  | Gadget         | 15       | 9.99   | 2
---+----------------+----------+--------+----------
```

Empty values are shown as `(null)`.

Because `.db` files are binary, VSCode briefly shows its "file is binary" warning before the formatted view replaces it. This flash is expected.

## Requirements

None beyond VSCode itself. The SQLite engine is bundled with the extension (via `sql.js`), so there is nothing to install or configure.

## Extension Settings

This extension does not currently contribute any settings.

## Known Issues

* **Read-only.** The view displays data but does not save edits back to the database.
* **Brief binary-warning flash** when opening a file, as described under Features.

## Release Notes

### 0.0.1

Initial working version: double-click a `.db` file to view its tables and rows as formatted text.

---

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [sql.js](https://sql.js.org/)

**Enjoy!**
