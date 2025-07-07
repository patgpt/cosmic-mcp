name: "🐛 Bug Report"
description: "Create a report to help us improve"
title: "🐛 Bug: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!

  - type: textarea
    id: what-happened
    attributes:
      label: "What happened?"
      description: "A clear and concise description of what the bug is. If you can, please include the tool name and the input you provided."
      placeholder: "When I called the `create_object` tool with..., I expected... but instead..."
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: "Reproduction Steps"
      description: "Steps to reproduce the behavior."
      placeholder: |
        1. Call tool '...' with input '...'
        2. ...
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: "Relevant log output"
      description: "Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks."
      render: shell

  - type: dropdown
    id: server-version
    attributes:
      label: "Server Version"
      description: "What version of the Cosmic MCP server are you running?"
      options:
        - 1.0.0
    validations:
      required: true

  - type: dropdown
    id: os
    attributes:
      label: "Operating System"
      description: "What operating system are you using?"
      options:
        - "macOS"
        - "Windows"
        - "Linux"
    validations:
      required: true

  - type: checkboxes
    id: terms
    attributes:
      label: "Code of Conduct"
      description: "By submitting this issue, you agree to follow our [Code of Conduct](https://github.com/your-username/your-repo/blob/main/CODE_OF_CONDUCT.md)"
      options:
        - label: "I agree to follow this project's Code of Conduct"
          required: true 