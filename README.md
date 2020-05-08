# What Is this Repository?

This repository hosts content for the documentation section of the Arduino Pro website. The content needs to be written in Markdown and will be converted 

# How can I contribute?

Contributing by creating content or suggestion changes to existing content can be done by making pull requests. You start by creating forking the `master` branch. Make a copy of the `template` folder and modify that if you're creating a new document.

When you're done with a draft you can create a pull request. This will give the content team the possibility to review it and leave comments or request changes. During this review process you can continue to push commits to the same branch. They will show up in the pull request automatically. Once the pull request gests merged into master, the content will be deployed to the staging server where you will be able to have a final look on how it looks on the website. When everything looks fine, one of the repository maintainers will create a release of the latest version. This will then be automatically deployed to the production server.



# How do I use Markdown to Write Content?

Markdown is a simple language that forces authors to focus on semantics rather than styling. Therefore it's important to adhere to the convetions mentioned in this document. This will ensure proper rendering of the content on the website.

## How can I add headings?

For headings you need to use the hash symbol #. # stands for H1, ## for H2 and ### for H3. We only use three heading levels. Using more than three leads to undefined rendering of the content.

## How can I emphasize text?

We use only two different types of emphasis. When emphasizing singe words we use a double asterisk syntax: `**I am bold**`.

For important notes we use a tripple asterisk syntax to highlight the complete paragraph `*** Note: This is important! ***`. You can still emphasize single words inside such a block `*** **Note:** This is important! ***`.

## How do I create a list?

Lists can be created by using a dash - character at the beginning of a line of text. E.g. `- First list item` will be rendered as:

- First list item

## How can I include images?

Images need to be put in the asset folder of the tutorial. They can then be included by using the syntax `!(Image caption)[(assets/imagename.svg)]`

Images which contain purely vector data should be exported as SVG files. Raster images such as screenshots should be exported as PNG or WEBP.

## How can I include code snippets?
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

## How can I transfer existing content from a Google Doc?

The easiest way to convert content from a Google Doc to markdown is to use the following web tool: https://euangoddard.github.io/clipboard2markdown/

You can copy & paste your content and it will automagically be converted to markdown. The markdown still needs to be tidied up and the image links need to be adjusted to refer to the `assets` path.