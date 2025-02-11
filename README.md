# IterateCV

An Obsidian-based project that uses bi-directional links to help you manage your Markdown CV/Resume content in a modular way with version control. Connect, update, export and iterate.

## Basic Elements

Basically, everything is inside a Markdown container

- Bullet points are in the format of Markdown lists
- Experience as a Markdown file
- CV/Resume as a Markdown file
    - Storage as a Markdown file, with Obsidian file links
    - Layout as a Markdown file
- You define attributes you care about in Markdown front matter or Dataview metadata fields

## At a Glance
### Screenshots
![A glance of main components](<assets/Overview EN.jpg>)

### Example of Exported PDFs
[PDF Example #1](<assets/Export Example - Default EN.pdf>)

## Looking into the Formats

### An Experience

An experience looks like [this](<src/IterateCV/600 Elements/EMPEN2 Stardust 1.md>)

```md
---
StartDate: 1987-01-01
EndDate: 1989-12-31
Location: Japan/Egypt
---

# FormalName:: Stardust Crusaders Expedition
Position:: Paranormal Investigator

---
- Led a team of Stand users across continents, eliminated suspicious flesh buds, and upheld cosmic balance
- Deployed Hermit Purple for remote espionage, gathering intel without blowing up hotel telephones
- Revitalised morale with a cunning sense of humour, ensuring swift Stand victories and minimal property damage

```

Other basic elements, such as skill elements, are similar in format and can be defined by you.

### A CV/Resume

A cv looks like [this](<src/IterateCV/700 Applications/RSMEN1 Default.md>)

```md
...
[[PRFEN1]]
[[EMPEN1 Speedwagon 1.md]]
...
```

That's about it. It's more for storing file associations, which means it should usually just contain links to other renderable components. If you want to preview your components, you may add a dataview query to the file, which won't take up too much space if you use a standard template.

### Layouts(Rendering/Composing/Exporting)

When you want to export your CV to other people, you use a layout describing file, like [this one](<src/IterateCV/700 Applications/XPTEN1 Default Layout.md>)

````md
---
RenderFile: "[[RSMEN2 Modified]]"
NewlineHeight: 90%
---

```dataviewjs
(...some logic to initialise the script...)

// this creates a section
rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFEN'},
    {'appendNewline': true}
);

// this creates another section
rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMEN',
     'sectionName': 'PERSONAL STATEMENT'},
    {'appendNewline': true}
);
```
````

By choosing which CV file to render, you can reuse the layout file for many CV files. Obsidian can use autocomplete to ask you which file to link to, and because it's in the front matter section, it won't be rendered when you export to PDF. You can also change some common settings there, for example the spacing control parameters.

And it should look like a real CV when you preview this file, where you can also proofread it.

### Multi Language Support

### Tailoring and Versioning

### Naming Rules

`typeCode`+`languageCode`+`id`+`shortTitle(optional)`+`versionNumber(when needed)`.md

For example, `EMPEN1 Speedwagon 1.md`

#### Why This Way?

- Files with the same type code and language code should be treated as the same type, e.g. the rendering strategy should be the same.
- It tells you enough information at a glance.
- With a unique identifier, which is the filename itself, when you link the file in Obsidian it does not need a folder path, which makes everything more readable.
- If you start linking files by typing, by just typing the first few characters, you should easily get the results you want.

#### What is Recommended

- Define an abbreviation rule for `typeCode` and `languageCode`. It should make sense to you and not be too long (as it will take up space in the tab bar on the UI).
- `languageCode`: you can use the default language/country code. Reference links:
    - https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
    - https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

## Features: Why This Project

- Automatically update content upon correction
- Rearrange experience/items instead of copy/paste/format brush
- Unified font format
- Copy/paste friendly for AI like chatgpt
- Full data control
- Flexible views
- Multiple language support
- Hide bullets when rendering

## Comparing with Traditional Ways

|                         | WYSIWYG editors(e.g. MS Word, LibreOffice)                   | IterateCV                                                    |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Format                  | Office file(e.g. .docx)                                      | Markdown text file (.md)                                     |
|                         | Every CV is a file                                           | Every experience/component/CV/layout is a Markdown file      |
| File preview            | Through Finder, Explorer or comparing view inside applications | Powered by Obsidian and Dataview, flexible and customisable with multiple windows |
| Version control         | Via filesystems by saving different CV files                 | Markdown is git compatible                                   |
| Good at                 | Trying/building layouts for first versions                   | Connect, update, export and iterate                          |
|                         | Storing CVs                                                  | Storing data but calculating CVs                             |
| Capabilities limited by | Your WYSIWYG editors                                         | - Obsidian<br />- Dataview<br />- Other markdown editors you are using<br />- Your coding knowledge on Javascript/HTML/CSS<br />- PDF format |

## Experience Improvement

- Spell checking: using Typora
- Text overflow: using VScode ruler
- Combine pdfs: Mac preview or script, or better export
- Page numbers: script or Acrobat (paid)

## Expected Programming Skills

- Markdown syntax
- Obsidian bidirectional links
    - Obsidian API (optional)
- Data View
    - Data query language (similar to SQL)
    - Dataview Javascript API
- Javascript Basics
    - For logic control
- HTML/CSS basics
    - For manipulating layout elements

## Trade-offs

- May take more time the first time you create a CV, especially if you adopt a new element layout for the CV.
    - Suggestion to test your new layout in WYSIWYG editors such as MS Word or Apple Pages first, then write your code
- Re-export happens more often

## Installation
1. ~~Download the archive from the release page~~ (at this stage, download [the project subdirectory](<src/IterateCV>) directly)
2. Open the folder in Obsidian
3. Install the plugins: Dataview and Templater
4. Enable JavaScript queries (DataviewJS) in the Dataview settings
5. Go through the sample files and start building your own CV

## Known Issues

- Page numbering is missing
- Flickering when updating content (DataviewJS issue)
- PDF layout issue with some fonts
- Changing an imported JS module requires forced reload of current project
- Headers not directly readable from DataviewJS

## Troubleshooting

- Summary/Personal statement not displayed? Its content needs to be a list.

## Risk Disclosure

- Remember to back up your data regularly
- You can still copy/paste your content into a word processor to create your resume,
    - If rendering layout fails
        - The data should still be there, i.e. the text stored in the element files.
    - If Dataview is not compatible (e.g. no longer maintained)
        - You should be able to find old versions of the Dataview plugin in backups, or hopefully on GitHub.
        - If you add an exclamation mark in front of file links in your CV file, you should be able to preview the content (not pretty, but it should work!)
    - If Obsidian is no longer useful to you
        - Backup your Obsidian installer
        - You should be able to open Markdown files with another text editor to copy/paste.
        - Bidirectional links are becoming a standard feature of many Markdown editors, hopefully you should be able to find alternatives for Obsidian.

## References

- [How to Take Smart Notes](https://www.goodreads.com/book/show/34507927-how-to-take-smart-notes)
- [LapisCV](https://github.com/BingyanStudio/LapisCV)
- [Dataview API](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvpagepathssource)
- [Obsidian API](https://docs.obsidian.md/Home)
- [Templater API](https://silentvoid13.github.io/Templater/internal-functions/overview.html)
- [Javascript cheat sheet](https://htmlcheatsheet.com/js/)
- [Css cheat sheet](https://htmlcheatsheet.com/css/)
- [Markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/)
