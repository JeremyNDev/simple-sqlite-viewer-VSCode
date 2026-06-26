# simple-sqlite-viewer README

A VSCode extension that lets you read SQLite `.db` files as plain text. Double-click a database file and its tables and rows are laid out in a readable, scrollable view.

## Features

Open any `.db` file from the Explorer and the extension reads the database, formats every table as aligned text, and shows it in an editor tab.

Each table is rendered with a banner, aligned columns separated by `|`, with header and border rules:

```
=============
=  items    =
=============

===⧧================⧧==========⧧========⧧==========
id | name           | quantity | price  | status_id
---+----------------+----------+--------+----------
1  | Widget         | 120      | 2.5    | 1
2  | Thingamajig    | 42       | (null) | 1
3  | Whatsit, large | 8        | 19     | 4
===⧧================⧧==========⧧========⧧==========
```

Empty values are shown as `(null)`.

Each table can be collapsed: fold the banner to hide its bottom border, and fold the header row to hide the data rows beneath it.

Because `.db` files are binary, VSCode briefly shows its "file is binary" warning before the formatted view replaces it. This flash is expected.

## Requirements

None beyond VSCode itself. The SQLite engine is bundled with the extension (via `sql.js`), so there is nothing to install or configure.

## Extension Settings

This extension does not currently contribute any settings.

## Known Issues

* **Read-only.** The view displays data but does not save edits back to the database.
* **Brief binary-warning flash** when opening a file, as described under Features. (I have no intention of fixing this since I need to trigger off that screen to open files cleanly)

## Release Notes

### 0.0.1

Initial working version: double-click a `.db` file to view its tables and rows as formatted text.

---

## Source
[github.com/JeremyNDev/simple-sqlite-viewer-VSCode](https://github.com/JeremyNDev/simple-sqlite-viewer-VSCode)

## License
[MIT](LICENSE) — free to use, modify, and distribute; please keep the attribution.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [sql.js](https://sql.js.org/)

**Enjoy!**
