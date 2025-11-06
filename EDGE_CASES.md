# Edge Cases and Special Scenarios

This document captures edge cases, special scenarios, and challenging data patterns that Data2LLM needs to handle gracefully.

---

## 1. Cell Content Edge Cases

### 1.1 Multi-line Cell Content

**Scenario:**
Excel cells can contain line breaks (Alt+Enter in Excel). When pasted, these become embedded newlines.

**Example Input:**
```
Task	Description
Design	Create mockups
Review feedback
Iterate
Development	Build frontend
Write tests
```

**Challenge:**
Distinguish between row breaks and embedded newlines within cells.

**Solution:**
- Excel clipboard format uses tabs for columns, newlines for rows
- Embedded newlines within cells are typically quoted or escaped
- Parse with quote-aware parser
- Count tabs to determine if newline is within cell or between rows

**Expected Handling:**
```markdown
## Task: Design
**Description:**
Create mockups
Review feedback
Iterate

## Task: Development
**Description:**
Build frontend
Write tests
```

### 1.2 Cells with Special Characters

**Scenario:**
Cells containing tabs, pipes, backticks, asterisks, or other Markdown special characters.

**Example Input:**
```
Command	        Description
git commit -m	Commit with message
echo "Hello"	Print to stdout
```

**Challenge:**
These characters have special meaning in Markdown and JSON.

**Solution:**
- Escape special characters in Markdown output (backticks, pipes, asterisks)
- Use proper JSON string escaping
- Wrap in code blocks when content is code-like

**Expected Handling:**
```markdown
| Command | Description |
|---------|-------------|
| `git commit -m` | Commit with message |
| `echo "Hello"` | Print to stdout |
```

### 1.3 Cells with Leading/Trailing Whitespace

**Scenario:**
Cells may have accidental spaces or tabs.

**Example Input:**
```
Name	      Value
  Theme  	Dark
Language	  English
```

**Challenge:**
Whitespace may be intentional or accidental.

**Solution:**
- Default: trim all cells during parsing
- Option: "Preserve whitespace" toggle for cases where it matters
- Show visual indicator if significant whitespace detected

### 1.4 Empty Cells vs. Cells with Whitespace

**Scenario:**
Empty cells vs. cells containing only spaces/tabs.

**Example Input:**
```
A	B	C
1		2
3	 	4
```

**Challenge:**
Distinguish truly empty from whitespace-only cells.

**Solution:**
- Treat whitespace-only as empty after trimming
- Track original if whitespace preservation enabled
- Count empty cells for sparsity calculation

### 1.5 Very Long Cell Content

**Scenario:**
Cells with extremely long content (>10,000 characters).

**Example:**
Entire documents or long code snippets pasted into cells.

**Challenge:**
- Browser performance
- Display issues
- Appropriate formatting

**Solution:**
- Detect long content (>1000 chars)
- Suggest document format with truncated preview
- Provide "Show full content" toggle
- Consider splitting into separate documents

### 1.6 Cells with URLs and Email Addresses

**Scenario:**
Cells containing URLs or email addresses.

**Example Input:**
```
Name	        Email	                Website
John Smith	john@example.com	https://example.com
```

**Challenge:**
Should these be converted to Markdown links?

**Solution:**
- Detect URLs and emails
- In Markdown: convert to links `[text](url)`
- In JSON: keep as plain strings
- Option: "Auto-link URLs" toggle

---

## 2. Structural Edge Cases

### 2.1 Inconsistent Column Count

**Scenario:**
Rows have different numbers of columns.

**Example Input:**
```
Name	Age	City
Alice	25	NYC
Bob	30
Charlie	28	LA	Extra
```

**Challenge:**
How to handle missing or extra columns?

**Solution:**
- Detect inconsistent columns
- Warn user: "Inconsistent columns detected (3, 2, 4)"
- For missing: pad with empty cells
- For extra: either append to last cell or create overflow column
- Suggest cleanup before transformation

### 2.2 No Header Row

**Scenario:**
Data has no header row, just values.

**Example Input:**
```
Alice	25	NYC
Bob	    30	LA
Charlie	28	Boston
```

**Challenge:**
Can't determine if first row is header or data.

**Solution:**
- Heuristic: check if first row is different type from second row
- If uncertain, ask user: "Does first row contain headers?"
- Provide "No headers" option that generates generic headers (Column 1, Column 2)
- For JSON, use array of arrays instead of array of objects

### 2.3 Multi-level Headers

**Scenario:**
Headers span multiple rows.

**Example Input:**
```
		2023		2024
	Q1	Q2	Q1	Q2
Sales	100	120	110	130
```

**Challenge:**
Standard parsers expect single header row.

**Solution:**
- Detect multi-level headers (empty cells in first row, values spanning)
- Offer to flatten: "2023 Q1", "2023 Q2", etc.
- Alternatively, use first non-empty level as headers
- Provide preview of flattened headers

### 2.4 Merged Cells (Implicit)

**Scenario:**
Excel merged cells show value only in first cell, rest are empty.

**Example Input:**
```
Project	        Task	        Status
Website	        Design	        Done
		        Development	    In Progress
Mobile App	    Planning	    Not Started
```

**Challenge:**
Empty cells are actually part of merged cell above.

**Solution:**
- Detect pattern: empty cell following content + content pattern below
- Offer to fill down: "Fill merged cells?"
- Show preview with filled values
- For hierarchical output, recognize as grouping structure

### 2.5 Fully Empty Rows or Columns

**Scenario:**
Entire rows or columns are empty.

**Example Input:**
```
Name	Age		City
Alice	25		NYC

Bob	    30		LA
```

**Challenge:**
Are these intentional separators or accidental?

**Solution:**
- Detect and highlight empty rows/columns
- Suggest removal: "2 empty rows and 1 empty column detected"
- Option to keep as separators in output
- For Markdown, could use `---` for empty rows

### 2.6 Single Cell Input

**Scenario:**
User pastes just one cell.

**Example Input:**
```
Just a single value
```

**Challenge:**
No structure to analyze.

**Solution:**
- Detect single cell
- Display: "Single value detected - no transformation needed"
- Option to wrap in simple list format
- Suggest this might not need the tool

---

## 3. Data Type Edge Cases

### 3.1 Ambiguous Number Formats

**Scenario:**
Numbers with different formatting conventions.

**Example Input:**
```
Price
1,234.56
1.234,56
1 234.56
$1,234.56
```

**Challenge:**
Detect locale-specific number formats.

**Solution:**
- Attempt to detect locale from majority pattern
- Preserve original formatting in text outputs
- For JSON, attempt to parse as number
- Show warning if mixed formats detected

### 3.2 Dates in Various Formats

**Scenario:**
Dates in different formats.

**Example Input:**
```
Date
01/02/2024
2024-01-02
Jan 2, 2024
02-01-2024
```

**Challenge:**
Ambiguous date formats (MM/DD vs DD/MM).

**Solution:**
- Detect date patterns
- Preserve original format (don't auto-convert)
- If converting to JSON, use ISO format
- Show warning if ambiguous formats detected

### 3.3 Boolean Values

**Scenario:**
Various representations of boolean values.

**Example Input:**
```
Enabled
Yes
No
TRUE
FALSE
1
0
✓
✗
```

**Challenge:**
Many ways to represent true/false.

**Solution:**
- Recognize common patterns: yes/no, true/false, 1/0, checkmarks
- For JSON output, convert to boolean primitives
- For text output, normalize to consistent format
- Provide option to keep original

### 3.4 Mixed Data Types in Column

**Scenario:**
Same column has different data types.

**Example Input:**
```
Value
100
N/A
200
-
150
null
```

**Challenge:**
How to handle in JSON? What type is the column?

**Solution:**
- Detect mixed types
- Show warning: "Column 'Value' has mixed types"
- Keep as strings in JSON (safest)
- Suggest user clean data first
- For Markdown, keep as-is

### 3.5 Formulas

**Scenario:**
Excel cells with formulas.

**Example Input:**
```
Item	Price	Quantity	Total
Widget	10	    5	        =B2*C2
```

**Challenge:**
When copied, shows formula or value depending on Excel settings.

**Solution:**
- If formula detected (starts with =), show warning
- "Formula detected - please copy values only"
- Provide instructions: "In Excel, use Paste Special > Values"
- Attempt to parse any actual computed values if present

---

## 4. Semantic Edge Cases

### 4.1 Hybrid Structures

**Scenario:**
Data that's part table, part list, part document.

**Example Input:**
```
Project: Website Redesign

Team Members:
Alice
Bob
Charlie

Milestones	Due Date	Status
Design	    Jan 15	    Complete
Dev	        Feb 1	    In Progress
```

**Challenge:**
Multiple structural patterns in one input.

**Solution:**
- Detect section boundaries
- Suggest splitting into separate transformations
- Option to process as multi-part document
- Each section gets appropriate format

### 4.2 Nested Lists in Cells

**Scenario:**
Cells containing lists (with line breaks).

**Example Input:**
```
Category	Items
Fruits	    Apples
            Bananas
            Oranges
Vegetables	Carrots
            Broccoli
```

**Challenge:**
List within a cell vs. separate rows.

**Solution:**
- Detect multi-line cells
- Treat as nested list structure
- In output, preserve nesting:
  ```markdown
  ## Fruits
  - Apples
  - Bananas
  - Oranges
  ```

### 4.3 Pivot Table Output

**Scenario:**
Data from Excel pivot tables with subtotals and grand totals.

**Example Input:**
```
Region	    Product	Sales
East	    A	    100
East	    B	    150
East Total		    250
West	    A	    120
West	    B	    140
West Total		    260
Grand Total		    510
```

**Challenge:**
Distinguish data rows from summary rows.

**Solution:**
- Detect total/subtotal rows (keywords: total, subtotal, sum)
- Suggest: "Pivot table detected - include totals?"
- Option to exclude summary rows
- Option to structure hierarchically with totals

### 4.4 Cross-tabulation

**Scenario:**
Matrix-style data with row and column headers.

**Example Input:**
```
	    East	West	North	South
Product A	100	150	    80	    120
Product B	110	145	    85	    125
Product C	105	160	    90	    130
```

**Challenge:**
Both dimensions are categorical, not just columns.

**Solution:**
- Detect cross-tab structure (first column and first row are headers)
- Suggest: "Cross-tabulation detected"
- Options:
  - Keep as table
  - Transpose
  - Convert to long format (Product, Region, Value)

### 4.5 Grouped Data with Subtotals

**Scenario:**
Data grouped by category with subtotals between groups.

**Example Input:**
```
Category	Item	    Amount
Fruits
		        Apples	10
		        Bananas	15
		        Subtotal	25
Vegetables
		        Carrots	8
		        Broccoli	12
		        Subtotal	20
```

**Challenge:**
Mixed grouping labels and data rows.

**Solution:**
- Detect grouping pattern
- Recognize subtotal rows
- Suggest hierarchical structure
- Option to include/exclude subtotals

---

## 5. User Input Edge Cases

### 5.1 Paste from Different Sources

**Scenario:**
Data pasted from sources other than Excel (Google Sheets, Word, HTML tables).

**Challenge:**
Different clipboard formats and delimiters.

**Solution:**
- Support multiple delimiters: tab, comma, pipe
- Auto-detect delimiter from first few rows
- Provide manual delimiter selector if auto-detect fails
- Handle HTML table paste (strip tags, extract text)

### 5.2 Incremental Edits

**Scenario:**
User pastes data, sees output, then modifies input.

**Challenge:**
Should suggestions change with each edit?

**Solution:**
- Re-analyze on significant changes (>20% different)
- Show indicator: "Analyzing..." during processing
- Debounce analysis (300ms after last keystroke)
- Keep previous format selection unless structure changes significantly

### 5.3 Very Large Datasets

**Scenario:**
User pastes >10,000 rows of data.

**Challenge:**
- Browser performance
- Processing time
- Display limits

**Solution:**
- Detect large dataset (>1000 rows)
- Show warning: "Large dataset detected (10,234 rows)"
- Analyze sample (first 100 rows) for pattern detection
- Provide "Process full dataset" option
- Consider chunked processing with progress indicator
- Limit preview display (first 100 rows)

### 5.4 Empty Input

**Scenario:**
User clears input or pastes empty cells.

**Challenge:**
Nothing to process.

**Solution:**
- Detect empty/whitespace-only input
- Clear output panel
- Show placeholder: "Paste your data here to get started"
- Clear suggestions
- Reset to default state

### 5.5 Invalid Characters

**Scenario:**
Input contains special Unicode characters, emojis, or non-printable characters.

**Example Input:**
```
Task	Status
Fix bug 🐛	Done ✓
Add feature	In Progress ⏳
```

**Challenge:**
Some characters may not render well or break parsing.

**Solution:**
- Support Unicode (most modern apps do)
- Show warning if unusual characters detected
- Option to strip emojis/special chars if needed
- Preserve in output unless user requests removal

---

## 6. Output Edge Cases

### 6.1 Very Long Output

**Scenario:**
Transformation produces >50,000 characters of output.

**Challenge:**
Display performance, copy limitations.

**Solution:**
- Show output length: "Output: 52,431 characters"
- Provide download option instead of/in addition to copy
- Truncated preview with "Show full" option
- Syntax highlighting may need to be disabled for very large outputs

### 6.2 Ambiguous JSON Structure

**Scenario:**
Data could be validly transformed to multiple JSON structures.

**Example Input:**
```
Name	Value
color	blue
size	large
```

**Could be:**
```json
{"color": "blue", "size": "large"}
```
or
```json
[{"name": "color", "value": "blue"}, {"name": "size", "value": "large"}]
```

**Solution:**
- Present both options in suggestions
- Default to most semantic option (key-value object)
- Allow user to toggle between representations

### 6.3 Markdown Rendering Issues

**Scenario:**
Generated Markdown has syntax that looks broken in preview.

**Example:**
- Table with columns of very different widths
- Lists with inconsistent indentation

**Solution:**
- Validate generated Markdown
- Normalize table column widths for readability
- Consistent indentation (2 or 4 spaces)
- Option to view raw vs. rendered

### 6.4 Line Ending Differences

**Scenario:**
Different systems use different line endings (CRLF vs LF).

**Challenge:**
May cause issues when pasting to different environments.

**Solution:**
- Normalize to LF internally
- Provide option for Windows (CRLF) output if needed
- Detect user's OS and default appropriately

---

## 7. Format-Specific Edge Cases

### 7.1 JSON: Key Name Conflicts

**Scenario:**
Column headers that would create invalid or conflicting JSON keys.

**Example Input:**
```
Name	Name	Value
A	    B	    1
```

**Challenge:**
Duplicate keys in JSON object.

**Solution:**
- Detect duplicate headers
- Show error: "Duplicate column names detected"
- Auto-resolve: append numbers (name_1, name_2)
- Suggest user fix headers before transformation

### 7.2 JSON: Invalid Key Names

**Scenario:**
Column headers with special characters or spaces.

**Example Input:**
```
First Name	Last Name	Email Address
```

**Challenge:**
Spaces and special chars in JSON keys.

**Solution:**
- Convert to valid JSON keys: `first_name`, `last_name`, `email_address`
- Options: snake_case, camelCase, preserve with quotes
- Show conversion: "first_name" ← "First Name"

### 7.3 Markdown: Table Alignment

**Scenario:**
Numeric data should be right-aligned, text left-aligned.

**Challenge:**
Markdown table alignment syntax.

**Solution:**
- Detect column types
- Apply appropriate alignment:
  ```markdown
  | Text | Number |
  |:-----|-------:|
  | A    | 100    |
  ```
- Option to override alignment

### 7.4 Markdown: Escaping

**Scenario:**
Content contains Markdown syntax characters.

**Example:**
```
Formula	        Description
*A = B*	        Multiply
[Link]	        Reference
```

**Challenge:**
Would be interpreted as Markdown syntax.

**Solution:**
- Escape special chars: `\*`, `\[`, `\]`
- Or use code formatting when appropriate
- Detect and suggest: "Special characters detected - escaping applied"

---

## 8. User Experience Edge Cases

### 8.1 Confidence Conflicts

**Scenario:**
Analysis produces two equally-scored format suggestions.

**Example:**
Two-column data that could be key-value OR just a simple table.

**Solution:**
- Show both as "equally good options"
- Highlight: "We found 2 equally suitable formats"
- Let user choose based on their use case
- Provide preview of both

### 8.2 User Overrides Suggestion

**Scenario:**
User chooses different format than suggested.

**Challenge:**
Should we learn from this?

**Solution:**
- Track user preferences (client-side storage)
- Show: "You prefer JSON for this type of data"
- Next time, rank user's preference higher
- Option to "Reset preferences"

### 8.3 Unexpected Result

**Scenario:**
User gets output but it's not what they expected.

**Solution:**
- Provide "Undo" to restore previous format
- "Try different format" quick toggle
- Clear explanation of what transformation was applied
- "Why this format?" info button

### 8.4 Copy Failure

**Scenario:**
Clipboard API fails (permissions, browser issues).

**Challenge:**
User can't copy output.

**Solution:**
- Fallback: select all text and prompt user to Ctrl+C
- Download as file option
- Show error message with instructions
- Test clipboard API support on load

---

## 9. Browser Compatibility Edge Cases

### 9.1 Clipboard API Support

**Scenario:**
Older browsers don't support modern Clipboard API.

**Solution:**
- Feature detection
- Fallback to `document.execCommand('copy')`
- Clear messaging if clipboard not available
- Download option as alternative

### 9.2 Performance Limits

**Scenario:**
Older/slower devices struggle with large datasets.

**Challenge:**
Processing time, memory limits.

**Solution:**
- Detect performance issues (processing > 2 seconds)
- Show warning for large datasets
- Offer to process in chunks
- Consider using Web Workers

### 9.3 Local Storage Limits

**Scenario:**
Saving preferences/history hits storage limits.

**Challenge:**
QuotaExceededError when saving.

**Solution:**
- Check available storage before saving
- Implement LRU cache for preferences
- Clear old history items
- Show warning if storage low

---

## 10. Special Scenarios

### 10.1 Code Snippets in Cells

**Scenario:**
Cells contain code snippets.

**Example Input:**
```
Language	Code
Python	    def hello(): print("hi")
JavaScript	const x = () => console.log("hi")
```

**Challenge:**
Should these be formatted as code blocks?

**Solution:**
- Detect code-like content (keywords, syntax)
- Wrap in code blocks with language hints
- In JSON, keep as strings but preserve indentation
- Option to "Format as code"

### 10.2 Mathematical Expressions

**Scenario:**
Cells contain mathematical notation.

**Example Input:**
```
Formula
x² + y² = r²
∑(i=1 to n) i
```

**Challenge:**
Preserve mathematical symbols and formatting.

**Solution:**
- Preserve Unicode math symbols
- Keep original formatting
- Don't attempt to parse or evaluate
- Option to wrap in LaTeX blocks for proper rendering

### 10.3 Multi-language Content

**Scenario:**
Data contains text in multiple languages, including RTL scripts.

**Example Input:**
```
Language	Greeting
English	    Hello
Arabic	    مرحبا
Chinese	    你好
```

**Challenge:**
Character encoding, text direction.

**Solution:**
- UTF-8 encoding throughout
- Preserve all Unicode characters
- Output should maintain proper rendering
- May need RTL markers in some contexts

### 10.4 Timestamped Data

**Scenario:**
Log-like data with timestamps.

**Example Input:**
```
Timestamp	        Event	        Details
2024-01-15 10:30	Login	        User: Alice
2024-01-15 10:31	Page View	    /dashboard
2024-01-15 10:32	Logout	        Session: 123
```

**Challenge:**
Maintain temporal relationships, consider sorting.

**Solution:**
- Detect timestamp columns
- Preserve original format
- Option to sort by time
- Consider time-series specific formats
- Keep timestamps readable in output

---

## Testing Strategy

### Unit Tests
- Test each edge case with specific examples
- Verify correct detection and handling
- Test error messages and warnings

### Integration Tests
- Test combinations of edge cases
- End-to-end transformation pipelines
- Real-world data samples

### Manual Testing
- User testing with diverse data sources
- Copy/paste from different applications
- Various browsers and devices

### Regression Tests
- Maintain suite of problematic examples
- Ensure fixes don't break previous behaviors
- Test with each new feature addition

---

## Error Handling Principles

1. **Fail Gracefully**: Never crash, always provide meaningful output
2. **Inform User**: Clear messages about what went wrong
3. **Suggest Solutions**: "Try removing empty rows" instead of just "Error"
4. **Provide Workarounds**: If auto-detection fails, allow manual override
5. **Preserve Data**: Never lose user's input, even on errors
6. **Log for Debugging**: Console logs for developers, user-friendly UI messages
7. **Recover When Possible**: Make best effort to process even problematic data

---

## Priority Classification

### Must Handle (P0)
- Multi-line cells
- Empty cells/rows/columns
- Inconsistent columns
- Basic special characters
- Mixed data types
- Large datasets (>1000 rows)

### Should Handle (P1)
- Multi-level headers
- Merged cells
- Pivot tables
- Cross-tabulation
- Code snippets
- URLs/emails

### Nice to Have (P2)
- Mathematical expressions
- Multi-language content
- Complex nested structures
- Formula detection
- Advanced Unicode support
