# What Is this Repository?

This repository hosts content for the documentation section of the Arduino Pro website. The content needs to be written in Markdown and will be converted to HTML automatically.

# How Can I Contribute?

Contributing by creating content or suggestion changes to existing content can be done by making pull requests. You start by forking the `master` branch. Create a new branch based on master and name it according to what you will create (e.g. `wifi-tutorial`). Make a copy of the `template` folder and modify that if you're creating a new document.

When you're done with a draft you can create a pull request. This will give the content team the possibility to review it and leave comments or request changes. During this review process you can continue to push commits to the same branch. They will show up in the pull request automatically. Once the pull request gests merged into master, the content will be deployed to the staging server where you will be able to have a final look on how it looks on the website. When everything looks fine, one of the repository maintainers will create a release of the latest version. This will then be automatically deployed to the production server.


# How Do I Use Markdown to Write Content?

Markdown is a simple language that forces authors to focus on semantics rather than styling. Therefore it's important to adhere to the convetions mentioned in this document. This will ensure proper rendering of the content on the website.

## How Can I Add Headings?

For headings you need to use the hash symbol `#`. # stands for H1, ## for H2 and ### for H3. We only use three heading levels. Using more than three leads to undefined rendering of the content.

## How Can I Emphasize Text?

We use only two different types of emphasis. When emphasizing singe words we use a double asterisk syntax: `**I am bold**`. This will be rendered as bold text. Italic is not supported.

For important notes we use a tripple asterisk syntax to highlight the complete paragraph `***Note: This is important!***`. You can still emphasize single words inside such a block by using the underscore syntax `***__Note:__ This is important! ***`.

We use single word emphasis for filenames and for referring to UI elements (e.g. a button label in the Arduino IDE).

## How Do I Create a List?

Lists can be created by using a dash - character at the beginning of a line of text. E.g. `- First list item` will be rendered as:

- First list item

## How Can I Include Images?

Images need to be put in the asset folder of the tutorial. They can then be included by using the syntax `!(Image caption)[(assets/imagename.svg)]`

Images which contain purely vector data should be exported as SVG files. Raster images such as screenshots should be exported as PNG or WEBP.

## How Can I Add Links?

Links can be added by using the following syntax: `[I'm a link](https://www.google.com)`. If you skip the first element `[Link Text]`the link URL will be used as the link text.

## How Can I Add Line Breaks?

To create a line break (`<br>`), end a line with two or more spaces, and then hit return.
```
This is the first line.  
And this is the second line.
```
Will be rendered as:
This is the first line.  
And this is the second line.

## How Can I Include Code Snippets?
Blocks of code are fenced by lines with three back-ticks <code>```</code>. Only the fenced code blocks support syntax highlighting. 

Example:

    ```js
    var s = "JavaScript syntax highlighting";
    alert(s);
    ```

becomes:

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

Inline code uses single back-ticks. E.g.

```no-highlight
Inline `code` has `back-ticks around` it.
```
Renders as: Inline `code` has `back-ticks around` it. 

We use inline code for everything that is an extract of a text file, a terminal command or output of a console.

The language of the code block always has to be specified by adding it right after the opening back-ticks (see example above). The supported language identifiers are as follows:


| Language   | ID       |
| ---------- | -------- |
| C++        | cpp      |
| C          | c        |
| YAML       | yml      |
| JavaScript | js       |
| Python     | py       |
| YAML       | yml      |
| Text       | text     |
| Shell      | sh       |
| Sass       | sass     |

To add a code block that doesn't need syntax highlighting use <code>```text</code>.

## How can I transfer existing content from a Google Doc?

The easiest way to convert content from a Google Doc to markdown is to use the following web tool: https://euangoddard.github.io/clipboard2markdown/

You can copy & paste your content and it will automagically be converted to markdown. The markdown still needs to be tidied up and the image links need to be adjusted to refer to the `assets` path.

## Best Practices
See https://www.markdownguide.org/basic-syntax

### Heading Best Practices

Markdown applications don’t agree on how to handle missing blank lines between a heading and the surrounding paragraphs. For compatibility, separate paragraphs and headings with one or more blank lines.

✅ **Do this**  
```
This is a paragraph.  

# Here's the heading  

And this is another paragraph.
```

❌ **Don't do this**  
```
This is a paragraph.  
# Here's the heading  
And this is another paragraph.
```

### Paragraph Best Practices

Don’t indent paragraphs with spaces or tabs.

✅ **Do this**  
```
Don't put tabs or spaces in front of your paragraphs.   
Keep lines left-aligned like this.
```

❌ **Don't do this**  
```
  This can result in unexpected formatting problems.  
    Don't add tabs or spaces in front of paragraphs.
```
