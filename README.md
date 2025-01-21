# IterateCV

An Obsidian-based project that uses bi-directional links to help you manage your CV content in a modular way with version control. Connect, update, export and iterate.

> [!IMPORTANT]
> This project is at pre-release stage; major changes to the CV layout file (like `XPTEN1 Default Layout.md`, which is used for composing & exporting) is coming very soon.

## Basic elements

Basically, everything is inside a Markdown container

- Bullet points are in the format of Markdown lists
- Experience as a Markdown file
- CV/Resume as a Markdown file
    - Storage as a Markdown file, with Obsidian file links
    - Layout as a Markdown file
- You define attributes you care about in Markdown front matter or Dataview metadata fields

## A glance
### Screenshots
![A glance of main components](<assets/Overview EN.jpg>)

### Example PDFs exported
[PDF Example #1](<assets/Export Example - Default EN.pdf>)

## Looking into the formats

### An experience

An experience looks like [this](src/IterateCV/600 Elements/EMPZH2 Stardust 1.md)

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

Other basic elements, for example, skill elements, are similar in format and you can define by yourself.

### A CV/Resume

A cv looks like [this](src/IterateCV/700 Applications/RSMEN1 Default.md)

```md
...
[[PRFEN1]]
[[EMPEN1 Speedwagon 1.md]]
...
```

That's it. It's more for storing file connections, which means usually it should just contain links to other renderable components. If you want a preview of its components, you may add a Dataview query in the file, which won't take too much space if you use a standard template.

### Layouts(Rendering/Composing/Exporting)

When you want to export your CV to other people, you use a layout describing file, like [this one](src/IterateCV/700 Applications/XPTEN1 Default Layout.md)

```md
---
RenderFile: "[[RSMEN2 Modified]]"
NewlineHeight: 90%
---

...
let render_file = dv.current().file.frontmatter.RenderFile;
renderer.newlineHeight = dv.current().file.frontmatter.NewlineHeight;
let allOutlinks = renderer.getAllOutlinks(render_file)

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFEN'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMEN',
     'sectionName': 'PERSONAL STATEMENT'},
    {'appendNewline': true}
);
...
```

By choose which CV file for rendering, you can reuse the layout file for many CV files. Obsidian is able to prompt you with auto completion for which file to link, and since it's in the front matter section, it won't get rendered when exporting to PDF. You can also change some frequent settings here, for example, spacing control parameters.

And it should look like a real CV to you when you previewing this file, where you can also do proofreading.

### Multi language support

### Tailoring and versioning

### Naming rules

`typeCode`+`languageCode`+`id`+`shortTitle(optional)`+`versionNumber(when needed)`.md

For example, `EMPEN1 Speedwagon 1.md`

#### Why this way?

- Files sharing the same type code and language code should be treated as the same kind, for example, the rendering strategy should be the same.
- It tells you enough information as a glimpse.
- With a unique identifier, which is the file name itself, when you link the file in obsidian, it does not require folder path, making everything more readable.
- When you start linking files by typing, by just keying the first several characters, you should be able to get the results you want easily.

#### What is recommended

- Determine an abbreviation rule for `typeCode` and `languageCode`. It should make sense to yourself, and not too long(as it takes space in the tab bar on the UI).
- `languageCode`: you can use the standard code of language/country. Reference link:
    - https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
    - https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

## Features: Why this project

- Automatic content update on correction
- Rearrange experience/items rather than copy/paste/format brush
- Unified font format
- Copy/paste friendly for AI like chatgpt
- Full data control
- Flexible views
- Multiple language support
- Hide bullets when rendering

## Comparing with traditional ways

|                         | WYSIWYG editors(e.g. MS Word, LibreOffice)                   | IterateCV                                                    |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Format                  | Office file(e.g. .docx)                                      | Markdown text file (.md)                                     |
|                         | Every CV is a file                                           | Every experience/component/CV/Layout is a Markdown file      |
| File preview            | Through Finder, Explorer or comparing view inside applications | Powered by Obsidian and Dataview, flexible, customisable with multiple windows |
| Version control         | File by saving                                               | Markdown is git compatible                                   |
| Good at                 | Trying/building layouts for first versions                   | Connect, update, export and iterate                          |
|                         | Storing CVs                                                  | Storing data but calculating CVs                             |
| Capabilities limited by | Your WYSIWYG editors                                         | - Obsidian<br />- Dataview<br />- Other markdown editors you are using<br />- Your coding knowledge on Javascript/HTML/CSS<br />- PDF format |

## Experience improvement

- Spelling checking: using Typora
- Text overflow: using vscode ruler
- Combine pdfs: Mac preview or script, or better export
- Page numbers: script or Acrobat(paid)

## Programming knowledge to expect

- Markdown syntax
- Obsidian bidirectional links
    - Obsidian API(optional)
- Dataview
    - Data Query Language (similar to SQL)
    - Dataview Javascript API
- Javascript Basics
    - For logic control
- HTML/CSS basics
    - For layout element manipulation

## Trade-offs

- May take more time on initial CV building, especially adopting a new element layout of CV
    - Suggesting you test your new layout in WYSIWYG editors like MS Word or Apple Pages first, then write your code
- Re-exporting happens more often

## Installation
1. ~~Download the archive in release page~~ (during this stage download  [the project subfolder](src/IterateCV) directly)
2. Open the folder in Obsidian
3. Install plugins: Dataview and Templater
4. Enable JavaScript queries (DataviewJS) in the settings of Dataview
5. Going through the example files and start your own CV building

## Known issues

- Page numbering
- Flickering on content update(DataviewJS issue)
- PDF layout issue in some fonts
- Modifying a imported JS module requires force reload of current project
- Headers are not directly readable from DataviewJS

## Troubleshooting

- Summary not shown? It needs to be a list.

## Risks disclosure

- Remember to backup your data regularly
- You can still copy/paste your content to a word processor to create your CV,
    - When rendering layout failed
        - Data should be still there, by which I mean the text stored in element files
    - In case Dataview is not compatible (for example, no longer maintained)
        - You shall find old version of Dataview plugin from backups, or hopefully on GitHub
        - If you add an exclamation in front of file links in you CV file, you should be able to preview the content (though not beautiful, but it should work!)
    - In case Obsidian is no longer usable to you
        - You shall backup your Obsidian installer
        - You shall be able to open Markdown files with another text editor, to copy/paste
        - Bidirectional links are becoming a standard feature for many Markdown editors, hopefully you should be able to find alternatives for Obsidian

## References

- How to take smart notes
- [LapisCV](https://github.com/BingyanStudio/LapisCV)
- Dataview API
- Obsidian API
- Templater API
- Javascript cheat sheet
- Css cheat sheet
- Markdown cheat sheet
