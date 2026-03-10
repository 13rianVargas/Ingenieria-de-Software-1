# Copilot Instructions for Ingenieria-de-Software-1 Repository

This repository does not contain any executable source code. It is a collection
of Scrum/Agile documentation used for a software engineering course. The
primary folders are:

- `Scrum BackLog/` – contains `backlog.md` with a template and examples for a
  product backlog.  
- `Taller 3/` – holds `Taller 3 Scrum Context.md`, which is another piece of
  course documentation.

Because there is no build, test, or runtime environment, Copilot should treat
this repository as a markdown-only project. Suggestions should focus on
improving, extending or refactoring the documentation rather than writing code.

## Key Patterns and Conventions

* Files are plain Markdown; there are no scripts, configuration files, or
  programs to compile or execute.
* Naming conventions follow Spanish language descriptions, but structure is
  minimal—just top-level folders with individual `.md` files.
* Content is educational; Copilot should aim to help the user by generating
  meaningful prose (e.g. backlog templates, example stories, explanations of
  Scrum concepts) rather than implementing features.

## Typical Developer Workflows

There are no build or test commands.  Developers will usually:

1. Open the markdown files in the editor.
2. Add or modify backlog entries or documentation for “Taller 3”.
3. Commit changes with Git as part of course submissions.

Because of the simplicity, Copilot doesn’t need to suggest any tools beyond the
editor itself.


## Tips for the Agent

* When editing `backlog.md`, maintain the table structure shown and preserve the
  embedded prompt example.  New user stories should keep the columns:
  `ID`, `User Story`, `Prioridad (MoSCoW)`, `Estimación`, etc.
* In `Taller 3 Scrum Context.md`, mirror the existing style if more sections are
  added (likely Spanish narrative describing the exercise).
* Do not propose code samples, build scripts, or dependencies because none
  exist.
* If asked to create new files, default to markdown and continue the course
  orientation (e.g., new templates, meeting notes, etc.).

> ⚠️ If a user tries to treat this repository as a typical software project,
> remind them that it only contains documentation and that no compilation or
> runtime is available.

Please review and let me know if any areas are unclear or if further context is
needed before adding or editing content.