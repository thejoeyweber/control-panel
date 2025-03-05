

You are an expert software architect and product manager.

We are currently planning a rebuild of an application that we've prototyped. The **prototype** has been built to scaffold out the full or a part of the intended application. 

You will analyze it's codebase, take a step back, and generate the documentation described below. We want to capture thoughtful and well considered architecture of a production app version of what's prototyped. We want it to focus on overall architecture and business logic vs. specific technology/techstack.

I will provide:
1. A **summary** of my application’s intended purpose, scope, and high-level requirements.
2. The codebase of a **prototype** of a sloppy/exploratory/partial build of our application.

From this information, please produce **eight (8) key documents** in **Markdown** format. These eight documents are:

1. **System Context Diagram**  
2. **High-Level Feature List**  
3. **Use Case Descriptions**  
4. **Architecture Overview Diagram (C4 Model – Container Level)**  
5. **Data Model (Conceptual ER)**  
6. **High-Level Sequence / Flow Diagram**  
7. **Architecture Decision Record (ADR)**  
8. **Short “Wiki-Style” Overview**  

Each document should follow the structure below. Whenever possible, embed **Mermaid** diagrams for illustrative purposes. Where diagrams are less critical, simple bullet lists or tables are fine.

### 1. System Context Diagram
- Summarize external systems and users interacting with this system.
- Format: 
  - Either a textual bullet list or a Mermaid flowchart (e.g., `flowchart LR`).
- Provide a short explanation of each external actor or system.

### 2. High-Level Feature List
- Outline the major functionality or features the final system will provide.
- Provide short bullet points or a table describing the features.

### 3. Use Case Descriptions
- For each major use case, include:
  - **Actor(s)** involved
  - **Goal**
  - **Preconditions**
  - **Main Flow** (basic scenario steps)
  - **Alternate Flow(s)** (what happens on error conditions, invalid data, etc.)

### 4. Architecture Overview Diagram (C4 Model – Container Level)
- Show the major “containers” in your system (frontend, backend services, databases, etc.).
- If relevant, highlight external APIs or 3rd-party integrations.
- Use Mermaid flowchart or simple bullet outlines to describe each container.

### 5. Data Model (Conceptual ER)
- Provide an entity-relationship view showing main entities and their relationships (one-to-many, many-to-many, etc.).
- Use a Mermaid ER diagram or textual bullet points. 
- Include a brief explanation of each entity (list of key fields, etc.).

### 6. High-Level Sequence / Flow Diagram
- Pick a core process (or multiple if needed) and illustrate step-by-step interactions among components (User, Frontend, Backend, Database, etc.).
- Mermaid’s `sequenceDiagram` is encouraged.

### 7. Architecture Decision Record (ADR)
- Choose at least one **key** decision that shapes the overall application (e.g., selecting the database, framework, or messaging system).
- Include:
  - **Date**
  - **Status** (Accepted, Proposed, etc.)
  - **Context** (the problem or situation)
  - **Decision** (what was chosen and why)
  - **Rationale** (reasons for the choice)
  - **Consequences** (positive or negative outcomes, next steps)

### 8. Short “Wiki-Style” Overview
- Provide a succinct overview that can serve as a quick “table of contents” for the project.
- Summarize architecture, key features, data model, and links to any other important docs/ADRs.

---

### **Reference for My Input**  
**Application Summary**:  
```
<APPLICATION SUMMARY>
```

**Prototype Code / Relevant Snippets**:  
```
<CODE OR REPO SNIPPETS>
```

### **Additional Requirements**  
- Produce each of the eight documents in **Markdown** format.
- Where possible, embed **Mermaid** diagrams.
- Ensure each section is well-labeled with headers (e.g., `# System Context Diagram`, `# High-Level Feature List`, etc.).
- Limit each section to 1-2 pages (brief, yet complete).

### **Output Format**  
Your final answer should be a single Markdown file containing all sections in the order specified (1 through 8). Each section should begin with a level-one or level-two header (e.g., `#` or `##`).

---

Please confirm you understand the assignment, then proceed to generate the full Markdown documentation as requested.
