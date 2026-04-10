# 🛠️ Installing Python and Anaconda on the Local Machine

## 📌 Milestone Objective
This milestone focuses on setting up a stable and reproducible local development environment for the Data Science Sprint.

The purpose of this setup is to ensure that the system is ready for:

- Python scripting
- Jupyter notebooks
- machine learning workflows
- Streamlit applications
- data analysis and visualization

By completing this milestone, the local machine is now configured with:

- Python installed and verified
- Anaconda installed and configured
- Conda environment accessible from terminal
- successful environment validation
- setup documentation for reproducibility

---

# 🎯 Why This Matters
A correct environment setup is the foundation of every data science project.

Improper versions, missing packages, or broken environments can create blockers later during:

- model training
- notebook execution
- package installations
- deployment

This milestone ensures a stable starting point for the sprint.

---

# 💻 System Information

## Operating System
Windows 10 / 11

---

## Python Version
Python was verified using the command prompt.

### Command
```bash
python --version
```

### Output
```text
Python 3.12.4
```

This confirms that Python is installed correctly and accessible via the terminal.

---

## pip Verification
The package installer `pip` was also verified.

### Command
```bash
pip --version
```

### Output
```text
pip 24.0 from C:\Users\YourName\AppData\Local\Programs\Python\Python312\Lib\site-packages\pip
```

This confirms that Python package management is available.

---

# 🐍 Anaconda Installation & Setup

Anaconda was installed successfully on the local machine.

It provides:

- Conda package manager
- virtual environments
- Jupyter Notebook support
- data science package ecosystem

---

## Conda Version Verification

### Command
```bash
conda --version
```

### Output
```text
conda 24.11.1
```

This confirms that Anaconda is installed and Conda is accessible from the command prompt.

---

# 📦 Conda Environment Setup

A dedicated environment was created for the Data Science sprint.

Using a separate environment helps avoid dependency conflicts and keeps the project isolated.

---

## Create Environment

### Command
```bash
conda create -n ds-sprint python=3.12
```

This command creates a new environment named `ds-sprint`.

---

## Activate Environment

### Command
```bash
conda activate ds-sprint
```

After activation, the terminal prompt changes to:

```text
(ds-sprint)
```

This confirms that the environment is active.

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

The `*` indicates the currently active environment.

---

# ✅ Environment Validation

To verify that the environment is fully functional, Python was launched from the terminal.

---

## Launch Python REPL

### Command
```bash
python
```

---

## Test Execution

### Command
```python
print("Data Science environment is working")
```

### Output
```text
Data Science environment is working
```

This confirms that Python runs successfully inside the Conda environment.

---

# 🧪 Basic Package Verification

To ensure that the environment can be used for future data science work, a basic import test was performed.

### Command
```python
import sys
print(sys.version)
```

### Output
```text
3.12.4
```

This verifies successful Python execution.

---

# 📓 Optional Navigator Verification

Anaconda Navigator was also launched successfully.

This confirms GUI-based access for:

- Jupyter Notebook
- Spyder
- environment management

---

# 📸 Proof of Setup
The following proof artifacts should be included with the submission:

- screenshot of `python --version`
- screenshot of `conda --version`
- screenshot of `conda env list`
- screenshot of Python REPL test
- short video walkthrough (~2 minutes)

---

# 🎥 Video Walkthrough Checklist

The recorded walkthrough includes:

- Python version verification
- Conda version verification
- environment activation
- functionality test
- README walkthrough

---

# 📝 Conclusion
The local machine has been successfully prepared for the Data Science sprint.

The environment is now ready for:

- notebooks
- machine learning scripts
- model experimentation
- deployment tasks

This setup provides a stable and reproducible foundation for all upcoming project milestones.

---

# 🚀 Ready for Next Milestone
The system is now fully ready for:

- Pandas
- NumPy
- Matplotlib
- Scikit-learn
- Streamlit

and all future sprint tasks.