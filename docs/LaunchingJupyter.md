# Milestone 2: Jupyter Workspace Navigation & File Management

## Objective

The purpose of this milestone is to verify familiarity with the Jupyter Notebook workspace and ensure that notebooks are created, saved, and managed from the correct project directory.

This milestone focuses on **navigation, file organization, and notebook handling**, rather than data analysis or model development.

---

## Why This Matters

Many early issues in a Data Science sprint are caused by workspace mistakes rather than coding errors, such as:

- Launching Jupyter from the wrong directory
- Saving notebooks in unintended locations
- Losing track of notebooks and datasets
- Working in the wrong environment or kernel
- Accidental file duplication or misplacement

This milestone ensures that:

- notebooks are created in the correct project folder
- folder structure is organized and intentional
- file management is handled safely
- the correct Python kernel is being used

This serves as a foundational workspace verification step before beginning any analysis work.

---

## Tasks Completed

### 1. Launching Jupyter Notebook

Jupyter Notebook was launched from the terminal after navigating to the correct project directory.

### Commands Used

```bash
cd Desktop\S64-April2026-Team02_Data_Science_clinX
jupyter notebook
```

This ensured that the Jupyter Home interface opened with the correct project folder as the root workspace.

---

### 2. Understanding the Jupyter Home Interface

The following components of the Jupyter Home interface were identified and verified:

- File and folder listing area
- Navigation breadcrumbs
- New button for file and notebook creation
- File type indicators
- Current workspace directory

This helped confirm the location where notebooks and files would be created.

---

### 3. Navigating Project Folders

Folder navigation was verified through the Jupyter interface.

The following directories were created and explored:

```text
notebooks/
data/
scripts/
```

Navigation into and out of folders was tested using:

- direct folder click navigation
- breadcrumb navigation

This ensured correct mapping between Jupyter folders and the local file system.

---

### 4. Creating and Opening a Notebook

A new notebook was created inside the `notebooks` directory.

### Notebook Name

```text
workspace_navigation_verified.ipynb
```

The notebook was opened successfully and verified to use the correct Python kernel.

### Kernel Verified

```text
Python 3 (ipykernel)
```

---

### 5. Running a Test Cell

A simple test cell was executed to verify notebook functionality.

### Code Used

```python
print("Notebook is running from correct workspace")
```

### Output

```text
Notebook is running from correct workspace
```

This confirms that:

- the notebook opens correctly
- the kernel is active
- code execution is functioning

---

### 6. File Management Verification

Basic notebook file management actions were verified.

The following actions were performed:

- renamed notebook
- saved notebook
- closed notebook safely
- reopened notebook from Home interface

This ensures safe handling of notebook files during the sprint.

---

## Folder Structure

Current workspace structure:

```text
S64-April2026-Team02_Data_Science_clinX/
│
├── notebooks/
│   └── workspace_navigation_verified.ipynb
│
├── data/
│
├── scripts/
│
└── README.md
```

---

## Proof of Verification

The following proof files are included:

- notebook file
- screenshots of Jupyter Home interface
- screenshots of notebook execution
- screenshots of folder navigation

---

## Outcome

This milestone confirms that the Jupyter workspace is correctly set up and that notebook creation, navigation, saving, and reopening are functioning as expected.

The project workspace is now ready for upcoming Data Science tasks.