# User Stories and Use Cases

## Overview

This document captures detailed user scenarios for Data2LLM, illustrating the types of data transformations users need and how the tool should handle them.

---

## Story 1: The Idea Board

### Context
Sarah is a product manager who uses a sticky-note style board in Excel to organize feature ideas. She has buckets (columns) like "Must Have", "Nice to Have", "Future", with multiple ideas listed in rows under each bucket.

### Current Excel Format
```
Must Have          | Nice to Have        | Future
-------------------|---------------------|-------------------
User authentication| Dark mode           | AI assistant
Payment processing | Export to PDF       | Mobile app
Search functionality| Email notifications| API marketplace
Dashboard          | Collaborative editing| Plugin system
```

### Problem
When Sarah pastes this into ChatGPT as-is, the LLM treats it as a standard table and might try to analyze it statistically, when really she wants to discuss the ideas categorically.

### Desired Output (Markdown Lists)
```markdown
## Must Have
- User authentication
- Payment processing
- Search functionality
- Dashboard

## Nice to Have
- Dark mode
- Export to PDF
- Email notifications
- Collaborative editing

## Future
- AI assistant
- Mobile app
- API marketplace
- Plugin system
```

### Tool Behavior
1. Detect that each column represents a category/bucket
2. Suggest "Hierarchical List" format
3. Use column headers as section headers
4. Convert rows into list items under each section

---

## Story 2: The Text-Heavy Table

### Context
John is a researcher documenting interview findings. He has a table with short IDs in one column and long text responses in others.

### Current Excel Format
```
ID   | Question                    | Response
-----|----------------------------|------------------------------------------
P001 | What challenges do you face?| We struggle with data consistency across systems and often spend hours manually reconciling records
P002 | What would help most?      | An automated validation system that catches errors before they propagate
```

### Problem
When uploaded as CSV, the LLM struggles with the formatting of long text, and the table structure adds noise rather than clarity.

### Desired Output (Markdown with better formatting)
```markdown
## Participant P001

**Question:** What challenges do you face?

**Response:** We struggle with data consistency across systems and often spend hours manually reconciling records

---

## Participant P002

**Question:** What would help most?

**Response:** An automated validation system that catches errors before they propagate
```

### Tool Behavior
1. Detect text-heavy content in cells (high character count)
2. Recognize that first column is an identifier
3. Suggest "Document Format" instead of table
4. Transform each row into a readable section

---

## Story 3: The Configuration Data

### Context
Emily is a developer trying to explain API configuration options to ChatGPT to help write documentation.

### Current Excel Format
```
Parameter      | Type    | Description
---------------|---------|---------------------------
api_key        | string  | Authentication key
timeout        | integer | Request timeout in seconds
retry_count    | integer | Number of retry attempts
enable_logging | boolean | Enable debug logging
```

### Problem
This is essentially key-value data with metadata, and would be much clearer as JSON.

### Desired Output (JSON)
```json
{
  "parameters": [
    {
      "name": "api_key",
      "type": "string",
      "description": "Authentication key"
    },
    {
      "name": "timeout",
      "type": "integer",
      "description": "Request timeout in seconds"
    },
    {
      "name": "retry_count",
      "type": "integer",
      "description": "Number of retry attempts"
    },
    {
      "name": "enable_logging",
      "type": "boolean",
      "description": "Enable debug logging"
    }
  ]
}
```

### Tool Behavior
1. Detect structured data with typed fields
2. Recognize schema-like pattern
3. Suggest JSON format
4. Use column headers as JSON keys

---

## Story 4: The Transposed Data

### Context
Mike has quarterly sales data with months as rows and regions as columns, but for the LLM to analyze trends, it would be better with regions as rows and months as columns.

### Current Excel Format
```
Month | East | West | North | South
------|------|------|-------|------
Jan   | 100  | 150  | 80    | 120
Feb   | 110  | 145  | 85    | 125
Mar   | 105  | 160  | 90    | 130
```

### Desired Output (Transposed)
```
Region | Jan | Feb | Mar
-------|-----|-----|-----
East   | 100 | 110 | 105
West   | 150 | 145 | 160
North  | 80  | 85  | 90
South  | 120 | 125 | 130
```

### Tool Behavior
1. Detect time-series data
2. Suggest transpose operation
3. Show preview of both orientations
4. Let user choose based on their analysis goal

---

## Story 5: The Sparse/Irregular Data

### Context
Lisa has a brainstorming spreadsheet where ideas are scattered across cells irregularly, with empty cells throughout.

### Current Excel Format
```
Category A | Category B |            | Category C
-----------|------------|------------|-------------
Idea 1     | Idea A     |            | Idea X
Idea 2     |            |            | Idea Y
           | Idea B     |            |
Idea 3     | Idea C     |            | Idea Z
           |            |            | Idea W
```

### Problem
Empty cells create noise, and the irregular structure makes it hard for the LLM to parse.

### Desired Output (Cleaned List)
```markdown
## Category A
- Idea 1
- Idea 2
- Idea 3

## Category B
- Idea A
- Idea B
- Idea C

## Category C
- Idea X
- Idea Y
- Idea Z
- Idea W
```

### Tool Behavior
1. Detect sparse data with many empty cells
2. Filter out empty cells
3. Group by columns/categories
4. Suggest clean list format

---

## Story 6: The Simple List

### Context
Tom has a single column of tasks he wants to discuss with an LLM.

### Current Excel Format
```
Task
----------------
Review pull request
Update documentation
Fix login bug
Add unit tests
```

### Desired Output (Simple Markdown List)
```markdown
- Review pull request
- Update documentation
- Fix login bug
- Add unit tests
```

### Tool Behavior
1. Detect single column data
2. Suggest simple list format
3. Optionally remove header if not needed
4. Output as clean Markdown list

---

## Story 7: The Nested/Hierarchical Data

### Context
Rachel has project tasks organized with subtasks.

### Current Excel Format
```
Project        | Task              | Subtask
---------------|-------------------|------------------
Website Redesign| Design           | Create mockups
Website Redesign| Design           | User testing
Website Redesign| Development      | Frontend
Website Redesign| Development      | Backend
Mobile App     | Planning         | Requirements
Mobile App     | Planning         | Wireframes
```

### Desired Output (Nested JSON or Markdown)
```json
{
  "projects": [
    {
      "name": "Website Redesign",
      "tasks": [
        {
          "name": "Design",
          "subtasks": ["Create mockups", "User testing"]
        },
        {
          "name": "Development",
          "subtasks": ["Frontend", "Backend"]
        }
      ]
    },
    {
      "name": "Mobile App",
      "tasks": [
        {
          "name": "Planning",
          "subtasks": ["Requirements", "Wireframes"]
        }
      ]
    }
  ]
}
```

Or as Markdown:
```markdown
## Website Redesign

### Design
- Create mockups
- User testing

### Development
- Frontend
- Backend

## Mobile App

### Planning
- Requirements
- Wireframes
```

### Tool Behavior
1. Detect hierarchical structure (repeating parent values)
2. Identify levels of nesting
3. Suggest nested JSON or hierarchical Markdown
4. Group related items appropriately

---

## Story 8: The Key-Value Pairs

### Context
Alex has settings/configurations in two columns that should be presented as key-value pairs.

### Current Excel Format
```
Setting Name    | Value
----------------|------------------
Theme           | Dark
Language        | English
Notifications   | Enabled
Auto-save       | Every 5 minutes
```

### Desired Output (Simple Format)

**As Markdown:**
```markdown
- **Theme:** Dark
- **Language:** English
- **Notifications:** Enabled
- **Auto-save:** Every 5 minutes
```

**As JSON:**
```json
{
  "theme": "Dark",
  "language": "English",
  "notifications": "Enabled",
  "auto_save": "Every 5 minutes"
}
```

### Tool Behavior
1. Detect two-column structure with labels and values
2. Suggest key-value format
3. Offer both Markdown and JSON options
4. Handle property name normalization for JSON (spaces to underscores)

---

## Common Requirements Across Stories

1. **Preview in Real-Time**: Users should see output update as they paste/modify input
2. **Format Suggestions**: Tool should recommend best format but allow override
3. **Copy Button**: Easy one-click copy of the formatted output
4. **Undo/Redo**: Allow users to try different formats without losing data
5. **Save Preferences**: Remember user's format preferences for similar data structures
6. **Batch Processing**: Allow multiple transformations to be applied in sequence
7. **Custom Headers**: Option to customize or remove headers
8. **Empty Cell Handling**: Smart detection and handling of empty/null values

---

## User Interface Requirements

### Input Panel (Left)
- Large text area for pasting
- Preserve tabs/spacing from Excel
- Show row/column count
- Clear button

### Control Panel (Middle/Top)
- Format suggestions (highlighted recommended option)
- Manual format selection dropdown
- Transformation options (transpose, remove empties, etc.)
- Preview toggle

### Output Panel (Right)
- Formatted output display
- Syntax highlighting for JSON
- Copy button
- Download button (for large outputs)
- Format indicator (MD/JSON/TXT)

### Smart Suggestions Display
- "We detected: [structure type]"
- "Suggested format: [format] because [reason]"
- Alternative formats available
- Confidence indicator
