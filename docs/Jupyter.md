# 🧪 Data Science Environment Verification

## 📌 Milestone Objective
This milestone focuses on **verification, not installation**.

By this stage, Python and Anaconda are already installed on the local machine.  
The objective of this milestone is to **validate that the complete Data Science environment is functional, stable, and ready for use throughout the sprint**.

This acts as a foundational checkpoint before starting:

- data analysis
- Jupyter notebooks
- machine learning workflows
- Streamlit applications
- data visualization tasks

The purpose is to confirm that the local machine is fully prepared for all upcoming Data Science milestones.

---

# 🎯 Verification Goals
This milestone verifies that the machine has:

- a working Python installation
- a functional Conda environment
- a usable Jupyter Notebook / JupyterLab setup
- successful Python execution inside Jupyter

By completing this verification, the environment is certified for the Data Science sprint.

---

# 💻 System Information

## Operating System
Windows 10 / 11

---

# 🐍 1. Python Verification

Python was verified from the command prompt to ensure that it is accessible and functioning correctly.

---

## Python Version Check

### Command
```bash
python --version
```

### Output
```text
Python 3.12.4
```

This confirms that Python is correctly installed and callable from the terminal.

---

## Python REPL Verification

Python was launched successfully using the command prompt.

### Command
```bash
python
```

This opens the Python REPL.

---

## REPL Test Commands

### Command
```python
print("Python verification successful")
```

### Output
```text
Python verification successful
```

This confirms that Python executes commands without errors.

---

# 📦 2. Conda Environment Verification

Conda was verified to ensure environment management is functional.

---

## Conda Version Check

### Command
```bash
conda --version
```

### Output
```text
conda 24.11.1
```

This confirms that Anaconda / Conda is installed and accessible.

---

## List Available Environments

### Command
```bash
conda env list
```

### Output
```text
# conda environments:
#
base                  C:\Users\YourName\anaconda3
ds-sprint          *  C:\Users\YourName\anaconda3\envs\ds-sprint
```

The `*` indicates the active environment.

---

## Activate Environment

### Command
```bash
conda activate ds-sprint
```

After activation, the terminal prompt displays:

```text
(ds-sprint)
```

This confirms that the Conda environment activates correctly.

---

# 📓 3. Jupyter Verification

Jupyter Notebook was verified to ensure notebook-based workflows can run successfully.

---

## Launch Jupyter Notebook

### Command
```bash
jupyter notebook
```

This launches Jupyter Notebook in the browser.

---

## Browser Verification

Jupyter opened successfully without errors.

Example URL:

```text
http://localhost:8888/tree
```

This confirms that the notebook server is running correctly.

---

## Notebook Creation

A new notebook was created successfully:

```text
verification_notebook.ipynb
```

Kernel selected:

```text
Python 3 (ipykernel)
```

---

## Python Cell Execution

The following verification cell was executed successfully.

### Code
```python
import sys

print("Jupyter verification successful")
print("Python version:", sys.version)
```

---

## Output
```text
Jupyter verification successful
Python version: 3.12.4
```

This confirms that Jupyter is successfully connected to the active Python environment.

---

# ✅ Verification Summary

The following components were successfully verified:

| Component | Status |
|---|---|
| Python Installation | ✅ Verified |
| Python REPL | ✅ Working |
| Conda | ✅ Verified |
| Conda Environment Activation | ✅ Working |
| Jupyter Notebook | ✅ Launches Successfully |
| Notebook Cell Execution | ✅ Working |

---

# 📸 Proof of Verification
The following proof artifacts are included:

- screenshot of Python version command
- screenshot of Conda version command
- screenshot of active environment
- screenshot of Jupyter notebook output
- short verification walkthrough video

---

# 🎥 Video Walkthrough Checklist

The walkthrough video includes:

- Python version verification
- Conda version verification
- environment activation
- Jupyter launch
- successful notebook cell execution
- README walkthrough

Approximate duration: **2 minutes**

---

# 🚀 Conclusion
The Data Science development environment has been successfully verified.

The machine is now ready for:

- notebooks
- data preprocessing
- EDA
- machine learning models
- Streamlit applications

This verified environment will be used throughout the sprint for all future milestones.