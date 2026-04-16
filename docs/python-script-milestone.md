# Python Script Execution Milestone

## 1. Introduction

This milestone focuses on creating and executing a standalone Python script for data analysis. While Jupyter Notebooks are useful for exploration, Python scripts are essential for building repeatable, reusable, and automation-friendly workflows.

This milestone introduces script-based development and helps transition from interactive environments to structured execution.

---

## 2. Importance of Python Scripts

Python scripts are important because they:

* Enable repeatable and consistent execution of code
* Support automation of data-related tasks
* Allow code to be shared and reused easily
* Run independently without requiring interactive environments
* Represent production-level workflows in Data Science

Relying only on notebooks limits scalability and automation capabilities.

---

## 3. Creating a Python Script

A Python script file (`.py`) was created within the project structure.

* The script is named clearly to reflect its purpose
* It is stored in the appropriate folder (e.g., `scripts/`)
* It contains valid Python code without notebook-specific features

Example structure:

```id="4wz3ra"
project/
│
├── scripts/
│   └── analysis_script.py
```

---

## 4. Writing Simple Data Logic

The script includes basic data-related logic such as:

* Defining variables
* Performing simple calculations
* Working with small sample data
* Printing results to the console

Example:

```python id="m1t8qk"
# Simple data analysis logic

data = [10, 20, 30, 40, 50]

total = sum(data)
average = total / len(data)

print("Total:", total)
print("Average:", average)
```

This demonstrates how scripts process data step-by-step.

---

## 5. Running the Script

The script was executed using a terminal or code editor.

Command used:

```bash id="z2f6pb"
python analysis_script.py
```

Execution flow:

* Python runs the script from top to bottom
* Output is displayed in the console
* Errors are identified and corrected if needed

---

## 6. Script vs Notebook Execution

### Python Scripts:

* Run from start to end in a single execution
* Do not retain state between runs
* Suitable for automation and production

### Jupyter Notebooks:

* Allow interactive execution of individual cells
* Retain state across cells
* Suitable for exploration and experimentation

Understanding this distinction is essential for real-world workflows.

---

## 7. Best Practices Followed

* Clear and descriptive script naming
* Simple and readable code
* Use of print statements for output visibility
* Placement of scripts in a dedicated folder
* Avoidance of unnecessary complexity

---

## 8. Conclusion

Creating and running Python scripts is a foundational skill in Data Science. Scripts enable automation, improve reproducibility, and prepare code for real-world applications. This milestone builds confidence in executing code outside of notebooks and strengthens overall development practices.

---

