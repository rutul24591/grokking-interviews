"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-print-stylesheets-extensive",
  title: "Print Stylesheets",
  description:
    "Staff-level deep dive into print media query architecture, layout simplification strategies, page break control, print-specific typography, header and footer management, and systematic approaches to creating high-quality printed output from web applications.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "print-stylesheets",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "print stylesheets",
    "CSS media queries",
    "print layout",
    "accessibility",
    "PDF generation",
  ],
  relatedTopics: [
    "accessibility",
    "web-standards-and-compatibility",
    "asset-management",
    "progressive-enhancement",
  ],
};

export default function PrintStylesheetsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Print stylesheets</strong> are CSS rules applied specifically when a web page is printed or exported to PDF, transforming screen-optimized layouts into paper-friendly formats. The <code>@media print</code> media query enables targeting print output exclusively, allowing developers to hide navigation elements, adjust typography for physical media, control page breaks, linearize multi-column layouts, and optimize color usage for printing. While print may seem like a legacy concern in an increasingly digital world, many professional domains — legal documents, financial reports, medical records, educational materials, invoices, receipts, and government forms — still require high-quality printed output, and the ability to produce well-formatted prints from web content remains a critical feature for these applications.
        </p>
        <p>
          The fundamental challenge of print stylesheets is the mismatch between screen and paper as output media. Screens have variable viewport sizes, support interactivity, display in RGB color with backlighting, and scroll continuously. Paper has fixed page dimensions, is static, uses CMYK color with reflected light, and breaks content across discrete pages. What works beautifully on screen — sticky headers, hover effects, infinite scrolling, dark backgrounds, interactive charts, collapsible sections — is meaningless or problematic on paper. A print stylesheet must strip away screen-specific affordances and reformulate the content for a fixed-size, non-interactive, paginated medium.
        </p>
        <p>
          At the staff and principal engineer level, print output is often overlooked until a critical stakeholder requests it, at which point retrofitting print styles onto an application designed without them is painful and time-consuming. A proactive approach includes print considerations in the initial design system — defining which components need print variants, establishing print-specific typography scales, and creating print layout templates for common document types (reports, invoices, data tables). The CSS Paged Media specification provides properties for controlling page margins, headers, footers, page numbering, and orphan/widow line control, enabling sophisticated print output that rivals dedicated document formatting tools.
        </p>
        <p>
          Modern web applications increasingly use programmatic PDF generation as an alternative or complement to CSS print stylesheets. Server-side rendering to PDF using tools like Puppeteer, Playwright, or wkhtmltopdf provides more control over output but requires server infrastructure and may not match the screen layout exactly. Client-side print via <code>window.print()</code> uses the browser&apos;s built-in print engine, which applies CSS print stylesheets and produces output consistent with what the user sees on screen. The choice between CSS-based print and programmatic PDF generation depends on the required level of formatting control, the need for server-side generation (e.g., batch invoicing), and whether the output must match a specific template or simply be a readable version of the screen content.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>@media print:</strong> The CSS media query that targets print output, including physical printing, PDF export, and print preview. Styles within <code>@media print</code> blocks override screen styles when the document is printed. Print styles can be inline (within <code>@media print { }</code> in the main stylesheet) or in a separate stylesheet linked with <code>&lt;link rel=&quot;stylesheet&quot; href=&quot;print.css&quot; media=&quot;print&quot;&gt;</code>. The separate stylesheet approach prevents print styles from being downloaded until printing, though modern browsers typically fetch all stylesheets regardless of media type.
          </li>
          <li>
            <strong>Page Break Control:</strong> CSS properties that control where content breaks across pages. <code>break-before: page</code> forces a page break before an element, <code>break-after: page</code> forces one after, and <code>break-inside: avoid</code> prevents an element from being split across pages. These properties replace the older <code>page-break-before</code>, <code>page-break-after</code>, and <code>page-break-inside</code> properties. Controlling page breaks prevents tables from being split mid-row, headings from appearing at the bottom of a page without their following content, and images from being cropped across page boundaries.
          </li>
          <li>
            <strong>Widows and Orphans:</strong> Typography properties that prevent awkward text distribution across pages. An orphan is a single line of a paragraph at the bottom of a page, and a widow is a single line at the top of the next page. The <code>widows</code> and <code>orphans</code> CSS properties set the minimum number of lines that must appear together — <code>orphans: 3; widows: 3;</code> ensures at least three lines appear at the bottom and top of page breaks, improving visual quality.
          </li>
          <li>
            <strong>@page Rule:</strong> A CSS at-rule that defines properties for the printed page itself — dimensions, margins, orientation, and named page types. <code>{`@page { margin: 2cm; }`}</code> sets margins for all pages. <code>{`@page :first { margin-top: 5cm; }`}</code> sets a larger top margin for the first page (for title or letterhead). <code>{`@page :left`}</code> and <code>{`@page :right`}</code> target even and odd pages for book-style duplex printing. The @page rule also supports <code>size</code> for setting paper dimensions and orientation.
          </li>
          <li>
            <strong>Print Layout Simplification:</strong> The practice of transforming complex screen layouts (multi-column grids, sidebars, sticky elements, overlapping layers) into simple, single-column linear layouts suitable for paper. Print layouts typically hide navigation, sidebars, footers, advertisements, interactive controls, and decorative elements, leaving only the primary content in a readable, sequential flow. This linearization often requires overriding <code>display: grid</code> and <code>display: flex</code> with <code>display: block</code> and setting widths to 100%.
          </li>
          <li>
            <strong>URL Expansion:</strong> The practice of showing the actual URL of hyperlinks in printed output, since links are not clickable on paper. The CSS technique <code>{`a[href]::after { content: " (" attr(href) ")"; }`}</code> appends the URL in parentheses after each link text. This should be applied selectively — internal navigation links (anchors, menu items) should not show URLs, and very long URLs should be truncated or moved to footnotes to avoid disrupting the text flow.
          </li>
          <li>
            <strong>Color Optimization:</strong> Adjustments to color usage for print output. Dark backgrounds consume ink and reduce readability on paper. Print stylesheets typically force white backgrounds and dark text, remove background colors from decorative elements, ensure sufficient contrast for grayscale printing (many office printers are monochrome), and convert color-coded information (like status indicators) to patterns, labels, or icons that are distinguishable without color.
          </li>
          <li>
            <strong>Print-Specific Typography:</strong> Adjustments to typography for physical media. Serif fonts (like Georgia or Times New Roman) are traditionally more readable in print than sans-serif fonts (though this distinction has diminished with modern fonts). Font sizes should be specified in points (pt) rather than pixels (px) for print, as points are a physical unit defined as 1/72 of an inch. Line heights may need adjustment because screen-optimized line spacing (1.5-1.8) may be too generous for print where space is at a premium.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the print stylesheet architecture within a web application. The main stylesheet contains screen-optimized styles that define the interactive layout. The print stylesheet layer overrides these styles when <code>@media print</code> is active. The override cascade handles four categories: elements to hide (navigation, sidebars, footers, interactive controls, advertisements), layout transformations (multi-column to single-column, grid to linear flow), typography adjustments (font family, size in points, line height), and color simplification (white backgrounds, black text, transparent decorative backgrounds). The diagram shows how each category applies its overrides, with the specificity and cascade order ensuring print rules take precedence over screen rules.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/print-stylesheets-diagram-1.svg"
          alt="Print stylesheet architecture showing override cascade for hidden elements, layout transformation, typography, and color simplification"
          width={900}
          height={500}
        />
        <p>
          The second diagram shows the page break management strategy for a complex document. The document contains headings, paragraphs, tables, images, and code blocks. Page break rules prevent headings from appearing at the bottom of a page without following content (<code>break-after: avoid</code> on headings), prevent tables and images from being split across pages (<code>break-inside: avoid</code>), force new pages before major sections (<code>break-before: page</code> on chapter headings), and enforce widow/orphan minimums for paragraph text. The diagram illustrates how these rules interact — when avoiding a page break inside a large table would push it to the next page, leaving a large gap, the browser&apos;s print engine must balance multiple competing rules, sometimes relaxing constraints to produce the best overall layout.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/print-stylesheets-diagram-2.svg"
          alt="Page break management showing break rules for headings, tables, images, and text with competing constraint resolution"
          width={900}
          height={500}
        />
        <p>
          The third diagram depicts the comparison between CSS print stylesheets and programmatic PDF generation approaches. The CSS print path uses <code>window.print()</code>, which applies @media print styles and invokes the browser&apos;s native print dialog, producing output that matches the on-screen content structure. The programmatic PDF path renders the page in a headless browser (Puppeteer, Playwright), applies custom viewport sizes and CSS for PDF-specific formatting, and generates a PDF file without user interaction. The diagram shows the trade-offs: CSS print is client-side, immediate, and requires no server infrastructure but has limited layout control. Programmatic PDF offers precise control, server-side generation for batch processing, and custom headers/footers but requires server infrastructure and may not match the screen layout.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/print-stylesheets-diagram-3.svg"
          alt="Comparison of CSS print and programmatic PDF generation showing client vs server paths, capabilities, and trade-offs"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">CSS @media print</td>
              <td className="px-4 py-2">Client-side with no server dependency, uses native browser print engine, consistent with screen content, progressive enhancement, works with any content, immediate availability</td>
              <td className="px-4 py-2">Limited page layout control, browser rendering inconsistencies, poor support for page headers/footers/numbering, cannot generate files programmatically, user must initiate print</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Headless Browser PDF (Puppeteer)</td>
              <td className="px-4 py-2">Full CSS rendering fidelity, custom headers/footers/page numbers, server-side batch generation, controllable viewport and scale, API-driven generation</td>
              <td className="px-4 py-2">Requires server infrastructure with Chromium, high memory usage per render, slower than template-based generation, Chromium dependency adds deployment complexity</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Template-Based PDF (PDFKit, jsPDF)</td>
              <td className="px-4 py-2">Lightweight, no browser dependency, precise programmatic control over layout, efficient for structured documents like invoices, works client-side or server-side</td>
              <td className="px-4 py-2">Manual layout programming (no CSS), cannot render existing HTML/CSS, significant development effort for complex documents, limited to simple layouts without advanced formatting</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">CSS Paged Media (Prince, WeasyPrint)</td>
              <td className="px-4 py-2">Full CSS Paged Media specification support, running headers/footers, page counters, cross-references, footnotes, high typographic quality suitable for book publishing</td>
              <td className="px-4 py-2">Commercial licensing (Prince), limited browser CSS support, requires separate rendering engine, learning curve for paged media CSS properties</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Hide all non-content elements in print.</strong> Navigation bars, sidebars, footers, search boxes, social media widgets, cookie banners, chat widgets, advertisements, and interactive controls serve no purpose on paper and waste space. Use <code>display: none</code> in the print stylesheet for these elements. Be thorough — it is better to explicitly hide too many elements and add back the few that are needed than to leave clutter that degrades print quality.
          </li>
          <li>
            <strong>Linearize multi-column layouts to single-column.</strong> Print output is most readable in a single-column format that spans the full width of the page. Override grid and flexbox layouts with <code>display: block</code> and <code>width: 100%</code> in the print stylesheet. Sidebar content that is relevant for print (like table of contents or metadata) can be placed before or after the main content in the linear flow rather than beside it.
          </li>
          <li>
            <strong>Use page break properties to prevent awkward content splitting.</strong> Apply <code>break-inside: avoid</code> to tables, figures, code blocks, and cards to prevent them from being split across pages. Apply <code>break-after: avoid</code> to headings so they are not stranded at the bottom of a page without their following content. Use <code>break-before: page</code> for major section boundaries where a new page is appropriate. Set <code>orphans: 3; widows: 3;</code> on body text to prevent single-line fragments at page boundaries.
          </li>
          <li>
            <strong>Expand URLs for hyperlinks.</strong> Since links cannot be clicked on paper, reveal the URL using the <code>::after</code> pseudo-element and <code>attr(href)</code>. Apply this selectively — skip internal anchor links, navigation links, and redundant links where the URL is already visible in the text. For very long URLs, consider truncating with <code>word-break: break-all</code> to prevent them from overflowing the page width.
          </li>
          <li>
            <strong>Force white backgrounds and dark text for ink efficiency.</strong> Remove all background colors, gradients, and background images that consume ink without adding informational value. Force text to black (<code>color: #000 !important</code>) and backgrounds to white (<code>background: #fff !important</code>) for maximum contrast and minimum ink usage. Preserve background colors only where they carry meaning — such as colored status indicators in tables — and consider replacing them with patterns or borders.
          </li>
          <li>
            <strong>Use point-based font sizing for print.</strong> Screen-oriented font sizes in pixels or ems may not translate well to physical paper dimensions. Use points (pt) in print stylesheets — 12pt for body text and 10pt for fine print are standard print sizes. Adjust line height to approximately 1.3-1.5 for print (slightly tighter than screen-optimized 1.5-1.8) to use paper space more efficiently while maintaining readability.
          </li>
          <li>
            <strong>Test print output regularly across browsers.</strong> Chrome, Firefox, and Safari render print output differently, especially for page breaks, margin handling, and color management. Use the browser&apos;s print preview (or save-as-PDF) to verify output during development. Consider automating print output testing using Playwright&apos;s PDF generation to capture and compare print renders as part of the CI pipeline.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not having any print stylesheet at all.</strong> Without print-specific styles, browsers print the screen layout exactly as it appears — including navigation bars, sidebars, footers, advertisements, dark backgrounds consuming entire ink cartridges, and multi-column layouts that create tiny, unreadable text. A minimal print stylesheet that hides non-content elements and linearizes the layout takes under 30 minutes to create and dramatically improves print quality.
          </li>
          <li>
            <strong>Background colors and images printing as blank areas.</strong> By default, most browsers do not print background colors and images (users must enable this in print settings). If your design relies on background colors to convey meaning (colored table cells, status badges, highlighted sections), these will appear as blank white areas in most print output. Use borders, patterns, text labels, or icons as alternatives that print reliably regardless of browser settings.
          </li>
          <li>
            <strong>Tables that break mid-row across pages.</strong> Large tables that span multiple pages often break in the middle of a row, making the data on the second page difficult to read without the column headers. Apply <code>break-inside: avoid</code> to <code>&lt;tr&gt;</code> elements to prevent row splitting, and ensure that <code>&lt;thead&gt;</code> is used so that browsers can repeat table headers on each page (though browser support for <code>thead</code> repetition in print varies).
          </li>
          <li>
            <strong>Interactive elements that are meaningless on paper.</strong> Dropdowns, accordions, tabs, carousels, and collapsible sections hide content behind interactions that do not exist on paper. In print, either hide these elements entirely or expand them to show all content — a tabbed interface should print all tab panels sequentially, an accordion should print all sections expanded, and a carousel should print all slides in order. Failing to handle these leaves users with a printed page that shows only the default or currently visible tab/slide.
          </li>
          <li>
            <strong>Fixed and sticky positioned elements overlapping content.</strong> Elements with <code>position: fixed</code> or <code>position: sticky</code> (headers, floating action buttons, notification bars) remain fixed relative to the viewport on screen but behave unpredictably in print, often overlapping body content or appearing on every printed page. Override these with <code>position: static</code> in the print stylesheet to return them to normal document flow, or hide them entirely.
          </li>
          <li>
            <strong>Not testing with actual physical printers.</strong> Print preview and save-as-PDF provide a good approximation, but actual printer output can differ in color rendering, margin handling, and resolution. Test critical print use cases (invoices, reports, forms) with actual printers, including both color and monochrome printers, to verify that the output is professional and readable.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Stripe</strong> provides print-optimized invoice pages that transform the interactive dashboard view into a clean, professional invoice suitable for accounting and tax purposes. The print stylesheet hides the dashboard navigation, sidebar, and action buttons, expands the invoice to full width, forces a white background with black text, and includes the company logo and legal information that are hidden on screen. Stripe&apos;s invoices use page break controls to prevent line items from splitting across pages and include the full URL of the invoice as a reference at the bottom of the printed page.
        </p>
        <p>
          <strong>Wikipedia</strong> has one of the most thorough print stylesheets on the web, optimized for their primary use case of printing reference articles. The print stylesheet hides navigation, the sidebar, edit links, reference popups, and external link icons. It linearizes the multi-column layout, adjusts font sizes for print readability, and expands citation URLs so that references are usable on paper. Wikipedia&apos;s print output also handles their complex table formatting, ensuring that large data tables break sensibly across pages with repeated headers. The &ldquo;Printable version&rdquo; link provides an even more optimized view with additional content restructuring.
        </p>
        <p>
          <strong>Google Maps</strong> demonstrates print optimization for a highly interactive, visual application. When users print directions, Google Maps transforms the interactive map and turn-by-turn navigation into a printer-friendly format with a simplified map image, sequential direction steps in a linear list, distance and time information, and the destination address prominently displayed. The print output strips away the interactive map controls, search bar, and layers panel, producing a focused document that serves the specific use case of following printed directions.
        </p>
        <p>
          <strong>Government and legal services</strong> often require print-quality web output for official forms, permits, and documents. Services like the UK&apos;s GOV.UK design system include comprehensive print stylesheets as a core requirement, recognizing that citizens often need to print government communications for their records. Their approach includes specific print-only content (like &ldquo;Printed from gov.uk on [date]&rdquo;), expanded URLs for all links, monochrome-safe styling that works on the grayscale printers common in government offices, and page break management that keeps related form fields together.
        </p>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — A Guide to the State of Print Stylesheets
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              MDN — @media CSS At-Rule
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/css-printing" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — CSS for Print
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/css-page-3/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              W3C — CSS Paged Media Module Level 3
            </a>
          </li>
          <li>
            <a href="https://alistapart.com/article/goingtoprint/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              A List Apart — Going to Print
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you implement print support for a complex web
            application dashboard?
          </p>
          <p className="mt-2">
            A: I would start with a <code>@media print</code> stylesheet that addresses four layers. First, visibility — hide navigation, sidebars, toolbars, filters, action buttons, and any interactive elements that serve no purpose on paper using <code>display: none</code>. Second, layout — linearize the dashboard grid to a single-column flow using <code>display: block</code> and <code>width: 100%</code>, with each dashboard widget stacking vertically. Third, formatting — force white backgrounds and dark text, adjust font sizes to point-based units (12pt body, 16pt headings), and set appropriate page margins using <code>{`@page { margin: 2cm; }`}</code>. Fourth, pagination — add <code>break-inside: avoid</code> to individual dashboard cards so they are not split across pages, and <code>break-before: page</code> for major sections if the dashboard has distinct categories. For charts and visualizations, I would provide static image alternatives for print since interactive canvas or SVG charts may not render correctly. Finally, I would add a print-only header with the dashboard title, date generated, and any applied filters so the printed report has context.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: What are the key differences between using CSS print stylesheets
            and generating PDFs programmatically?
          </p>
          <p className="mt-2">
            A: CSS print stylesheets use the browser&apos;s native print engine, are client-side, require no server infrastructure, and produce output consistent with the screen layout. They work immediately via <code>window.print()</code> and require only CSS knowledge to implement. However, they offer limited control over page headers and footers, page numbering, and cross-browser rendering consistency. Programmatic PDF generation (using Puppeteer, Playwright, or dedicated PDF libraries) runs on the server, provides precise control over output (custom headers, footers, page numbers, watermarks), supports batch generation without user interaction, and produces consistent output regardless of the end user&apos;s browser. The trade-offs are server infrastructure costs, Chromium dependency for headless browser approaches, higher latency, and the need to maintain a rendering pipeline separate from the screen view. I would choose CSS print for user-initiated printing of existing screen content and programmatic PDF for server-generated documents with strict formatting requirements.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you handle page breaks to prevent awkward content splitting
            in print?
          </p>
          <p className="mt-2">
            A: I use three levels of page break control. First, <code>break-inside: avoid</code> on atomic content units — table rows, figure elements, cards, blockquotes, and code blocks — so they are not split mid-element across pages. Second, <code>break-after: avoid</code> on headings (h1 through h4) so they always appear on the same page as the content that follows them, not stranded at the bottom of a page. Third, <code>break-before: page</code> on major section boundaries where starting a new page is appropriate — chapter divisions in a report, the appendix section, or each new category in a catalog. Additionally, I set <code>orphans: 3; widows: 3;</code> on paragraph elements to prevent single-line fragments at page transitions. The challenge is that these rules can conflict — if a large table has <code>break-inside: avoid</code> but is taller than one page, the browser must break it somewhere. For such cases, I either remove the avoid rule for very large elements or restructure the content to fit within page boundaries.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you ensure printed output looks correct across
            different browsers?
          </p>
          <p className="mt-2">
            A: Cross-browser print consistency requires testing and pragmatic compromises. Chrome, Firefox, and Safari each interpret page break properties, margin calculations, and color management differently. I would establish a baseline by testing print output (save-as-PDF) in all target browsers and documenting the differences. For critical print outputs (invoices, legal documents), I would use the most conservative page break rules that produce acceptable results across all browsers, avoid relying on advanced features like <code>@page</code> named pages or running headers that have inconsistent support, and use explicit dimensions rather than percentage-based sizing that may calculate differently. Automated testing can be implemented using Playwright to generate PDF output from each browser engine and compare them pixel-by-pixel against approved baselines. For cases where browser differences are unacceptable, server-side PDF generation with a single rendering engine provides the consistency guarantee that CSS print cannot.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How do you handle interactive elements like tabs, accordions, and
            dropdowns in print output?
          </p>
          <p className="mt-2">
            A: Interactive elements that hide content behind user interactions present a significant print challenge because paper does not support interaction. I would handle each type specifically. For tabbed interfaces, the print stylesheet should override the tab visibility to show all tab panels sequentially — remove <code>display: none</code> from inactive panels and add section headings that indicate the tab names. For accordions and collapsible sections, expand all sections by overriding the collapsed state and removing the toggle controls. For dropdown menus and select elements, display the currently selected value as static text. For carousels, show all slides in a vertical stack. For modal dialogs, either hide them entirely if they contain transient content or show them inline if they contain important information. The general principle is to make all content visible and static — if information is important enough to exist in the application, it should be printable without interaction. I would also add print-specific headings or labels to distinguish sections that were separated by interactive controls on screen.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
