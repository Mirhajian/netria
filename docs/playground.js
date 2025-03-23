/**
 * Netria Playground - Interactive simulation of Netria Neovim plugin
 * 
 * This file simulates the behavior of the Netria plugin, which creates
 * a floating UI for the Netrw file explorer in Neovim.
 */

// Ensure hero content is visible on page load
document.addEventListener('DOMContentLoaded', function() {
    // Force hero content to be visible
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    
    if (heroContent) heroContent.style.opacity = '1';
    if (heroTitle) heroTitle.style.opacity = '1';
    if (heroSubtitle) heroSubtitle.style.opacity = '1';
    if (heroActions) heroActions.style.opacity = '1';
    
    // Smooth scroll to Netria section when clicking the Launch button
    const scrollToNetriaBtn = document.getElementById('scroll-to-netria');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollToNetriaBtn) {
        scrollToNetriaBtn.addEventListener('click', function() {
            const netriaSection = document.getElementById('netria-section');
            if (netriaSection) {
                // Get the height of the controls section
                const controlsSection = document.querySelector('.controls');
                // Calculate offset to position controls at the top with some padding
                const offset = -190; // Further adjusted to position the navbar above controls
                
                // Scroll with offset to position controls properly
                const sectionTop = netriaSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: sectionTop + offset,
                    behavior: 'smooth'
                });
                
                // Optional: Open Netria after scrolling
                setTimeout(openNetria, 1000);
            }
        });
    }
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const netriaSection = document.getElementById('netria-section');
            if (netriaSection) {
                // Same scroll behavior as the button
                const offset = -190;
                const sectionTop = netriaSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: sectionTop + offset,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Configuration settings
let config = {
    title: 'Netria',
    position: 'center', // Always centered
    width: 0.8,
    height: 0.85,
    border: true, // Always have border enabled
    border_style: 'solid', // Solid borders for more authentic Neovim look
    show_line_numbers: true,
    enable_banner: true,
    fixed: false, // Never fixed
    auto_open: true // Always auto-open
};

// File system simulation
const fileSystem = {
    'lua': {
        'netria': {
            'init.lua': '-- Netria main module\nlocal M = {}\n\nfunction M.setup(opts)\n  -- Initialize with options\nend\n\nreturn M',
            'ui.lua': '-- UI handling for Netria\nlocal M = {}\n\nfunction M.create_window()\n  -- Create floating window\nend\n\nreturn M',
            'config.lua': '-- Configuration module\nlocal M = {}\n\nM.defaults = {\n  title = "Netria",\n  position = "center"\n}\n\nreturn M'
        }
    },
    'assets': {
        'before.png': '[IMAGE CONTENT]',
        'after.png': '[IMAGE CONTENT]'
    },
    'docs': {
        'index.html': '<!DOCTYPE html>...',
        'styles.css': '/* Styles for Netria docs */',
        'script.js': '// Documentation scripts'
    },
    'README.md': '# Netria\n\nA clean, modern floating UI for Netrw in Neovim',
    'LICENSE': 'MIT License...',
    'sample.lua': '-- Sample Lua file\nlocal M = {}\n\nfunction M.hello()\n  print("Hello from Netria plugin!")\nend\n\nreturn M',
    'config.lua': '-- Configuration file\nreturn {\n  title = "Netria",\n  position = "center",\n  width = 0.7,\n  height = 0.8\n}'
};

// Current directory state
let currentPath = [];
let currentDirectory = fileSystem;

// Selected item index for keyboard navigation
let selectedItemIndex = -1;

// DOM elements
const netriaWindow = document.getElementById('netria-window');
const netriaContent = document.querySelector('.netria-content');
const netriaFiles = document.querySelector('.netria-files tbody');
const netriaBanner = document.querySelector('.netria-banner');
const configPanel = document.getElementById('config-panel');
const configDropdown = document.getElementById('config-dropdown');
const fileOperationModal = document.getElementById('file-operation-modal');
const modalTitle = document.getElementById('modal-title');
const fileOperationInput = document.getElementById('file-operation-input');
const confirmOperationBtn = document.getElementById('confirm-operation');
const cancelOperationBtn = document.getElementById('cancel-operation');

// Current operation type
let currentOperation = null;
let currentOperationTarget = null;

// Button elements - Fixed duplicate ID issue by using querySelectorAll
const toggleBtns = document.querySelectorAll('#toggle-btn');
const refreshBtn = document.getElementById('refresh-btn');
const configBtn = document.getElementById('config-btn');
const applyConfigBtn = document.getElementById('apply-config');
const netriaClose = document.querySelector('.netria-close');

// Direct event listener for the 'e' key
window.addEventListener('keydown', function(event) {
    // Only handle the 'e' key here
    if (event.key === 'e') {
        // Don't process if we're in an input field
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' || 
            document.activeElement.tagName === 'CODE') {
            return;
        }
        
        console.log('E key pressed directly');
        toggleNetria();
        event.preventDefault();
    }
});

// Remove duplicated event listener for 'e' key - we'll handle it in the main keyboard handler

// Remove tabs and use full editor view
document.addEventListener('DOMContentLoaded', function() {
    // Hide tab bar
    const tabBar = document.querySelector('.tabs');
    if (tabBar) {
        tabBar.style.display = 'none';
    }
    
    // Make the first editor content always visible
    const editorContents = document.querySelectorAll('.editor-content');
    if (editorContents.length > 0) {
        editorContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        editorContents[0].style.display = 'block';
    }

    // Fix duplicate toggle buttons issue
    if (toggleBtns.length > 1) {
        // Make both buttons work
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Toggle button clicked');
                toggleNetria();
            });
        });
    }
});

// Toggle Netria window
function toggleNetria() {
    console.log('Toggle called, current state:', netriaWindow.classList.contains('hidden') ? 'hidden' : 'visible');
    
    if (netriaWindow.classList.contains('hidden')) {
        console.log('Opening Netria');
        openNetria();
    } else {
        console.log('Closing Netria');
        closeNetria();
    }
    
    console.log('After toggle, state:', netriaWindow.classList.contains('hidden') ? 'hidden' : 'visible');
}

// Open Netria window
function openNetria() {
    // First ensure the window is visible
    netriaWindow.style.visibility = 'visible';
    netriaWindow.style.display = 'flex';
    // Then remove the hidden class
    netriaWindow.classList.remove('hidden');
    
    // Apply window position - always centered
    netriaWindow.className = 'netria-window';
    
    // Update title
    document.querySelector('.netria-title').textContent = ' ' + config.title + ' ';
    
    // Show/hide banner
    netriaBanner.style.display = config.enable_banner ? 'block' : 'none';
    
    // Set window dimensions
    netriaWindow.style.width = (config.width * 100) + '%';
    netriaWindow.style.height = (config.height * 100) + '%';
    netriaWindow.style.maxHeight = '550px';
    
    // Apply border style - always have border
    let borderStyle = '1px solid var(--border-color)';
    
    switch (config.border_style) {
        case 'rounded':
            netriaWindow.style.borderRadius = '8px'; 
            break;
        case 'none':
            borderStyle = 'none';
            break;
        case 'double':
            borderStyle = '4px double var(--border-color)';
            break;
        case 'solid':
            borderStyle = '2px solid var(--border-color)'; // Thicker border for better visibility
            netriaWindow.style.borderRadius = '8px'; // Add border radius for solid style too
            break;
        case 'shadow':
            borderStyle = 'none';
            netriaWindow.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6)';
            break;
    }
    
    if (config.border_style !== 'shadow' && config.border_style !== 'none') {
        netriaWindow.style.border = borderStyle;
    } else {
        netriaWindow.style.border = 'none';
    }
    
    // Handle line numbers
    const lineNumbers = document.querySelectorAll('.line-number');
    if (config.show_line_numbers) {
        lineNumbers.forEach(ln => ln.style.display = 'table-cell');
    } else {
        lineNumbers.forEach(ln => ln.style.display = 'none');
    }
    
    // Refresh files display
    refreshFilesList();
    
    // Add overlay effect to prevent seeing through
    document.querySelector('.playground-area').classList.add('netria-active');
    
    // Ensure completely solid background for Netria window
    netriaWindow.style.backgroundColor = '#1e1e2e';
    netriaWindow.style.background = '#1e1e2e';
    netriaWindow.style.backdropFilter = 'none';
    netriaWindow.style.webkitBackdropFilter = 'none';
    netriaWindow.style.opacity = '1';
    
    // Apply solid background to all child elements
    document.querySelector('.netria-header').style.backgroundColor = '#2a2a3a';
    document.querySelector('.netria-header').style.background = 'linear-gradient(to right, #2a2a3a, #323248)';
    document.querySelector('.netria-content').style.backgroundColor = '#1e1e2e';
    document.querySelector('.netria-content').style.background = '#1e1e2e';
    document.querySelector('.netria-files').style.backgroundColor = '#1e1e2e';
    document.querySelector('.netria-files').style.background = '#1e1e2e';
    
    // Force solid background by setting blend modes
    document.querySelectorAll('.netria-window, .netria-window *').forEach(el => {
        el.style.backgroundBlendMode = 'normal';
        el.style.mixBlendMode = 'normal';
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
    });

    // Add entrance animation
    netriaWindow.style.animation = 'fadeInScale 0.3s cubic-bezier(0.19, 1, 0.22, 1)';
}

// Close Netria window
function closeNetria() {
    // Add exit animation
    netriaWindow.style.animation = 'fadeOutScale 0.2s cubic-bezier(0.19, 1, 0.22, 1)';
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        // Make sure the hidden class is applied properly
        netriaWindow.classList.add('hidden');
        // Also set visibility to hidden for good measure
        netriaWindow.style.visibility = 'hidden';
        netriaWindow.style.display = 'none';
        // Remove overlay effect
        document.querySelector('.playground-area').classList.remove('netria-active');
        console.log('Netria should now be hidden');
    }, 150); // shorter than the animation to avoid lag
}

// Refresh files list
function refreshFilesList() {
    // Clear existing files
    netriaFiles.innerHTML = '';
    
    // Navigate to current directory based on path
    let current = fileSystem;
    for (const dir of currentPath) {
        current = current[dir];
    }
    currentDirectory = current;
    
    // Create path display
    const pathDisplay = document.createElement('tr');
    pathDisplay.className = 'path-display';
    const pathTd = document.createElement('td');
    pathTd.colSpan = config.show_line_numbers ? 2 : 1;
    pathTd.innerHTML = '<i class="fa fa-folder-open-o"></i> /' + currentPath.join('/');
    if (currentPath.length > 0) {
        pathTd.innerHTML += ' <a href="#" class="go-up">[-]</a>';
    }
    pathDisplay.appendChild(pathTd);
    netriaFiles.appendChild(pathDisplay);
    
    // Add go-up functionality
    const goUpLink = pathDisplay.querySelector('.go-up');
    if (goUpLink) {
        goUpLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateUp();
        });
    }
    
    // Add files and directories
    let lineCounter = 6; // Start from 6 since banner takes up 5 lines
    
    // Sort entries: directories first, then files
    const sortedEntries = Object.entries(current).sort((a, b) => {
        const aIsDir = typeof a[1] === 'object';
        const bIsDir = typeof b[1] === 'object';
        
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a[0].localeCompare(b[0]);
    });
    
    let fileItems = [];
    
    sortedEntries.forEach(([name, content], index) => {
        const isDirectory = typeof content === 'object';
        const row = document.createElement('tr');
        row.className = isDirectory ? 'dir' : 'file';
        
        // Add staggered entrance animation
        row.style.animation = `fadeInRight 0.3s cubic-bezier(0.19, 1, 0.22, 1) ${index * 0.03}s forwards`;
        row.style.opacity = '0';
        
        if (config.show_line_numbers) {
            const lineNumberCell = document.createElement('td');
            lineNumberCell.className = 'line-number';
            lineNumberCell.textContent = lineCounter++;
            row.appendChild(lineNumberCell);
        }
        
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `<i class="fa fa-${isDirectory ? 'folder-o' : 'file-text-o'}"></i> ${name}${isDirectory ? '/' : ''}`;
        row.appendChild(nameCell);
        
        // Handle click event
        row.addEventListener('click', () => {
            selectItem(row);
            if (isDirectory) {
                navigateTo(name);
            } else {
                openFile(name);
            }
        });
        
        netriaFiles.appendChild(row);
        fileItems.push({ row, name, isDirectory });
    });
    
    // If we have items, select the first one by default
    if (fileItems.length > 0) {
        selectItem(fileItems[0].row);
        selectedItemIndex = 0; // Explicitly set the selected index
    } else {
        selectedItemIndex = -1; // No items to select
    }
}

// Select an item in the file list
function selectItem(row) {
    // Remove selection from all rows
    document.querySelectorAll('.netria-files tr').forEach(r => {
        r.classList.remove('selected');
    });
    
    // Add selection to this row with subtle animation
    row.style.transition = 'background-color 0.2s ease';
    row.classList.add('selected');
    
    // Update selected index
    const allRows = Array.from(document.querySelectorAll('.netria-files tr:not(.path-display)'));
    selectedItemIndex = allRows.indexOf(row);
}

// Navigate with keyboard
function navigateList(direction) {
    const allRows = Array.from(document.querySelectorAll('.netria-files tr'));
    
    // Skip the path display row
    const fileRows = allRows.filter(row => 
        !row.classList.contains('path-display')
    );
    
    if (fileRows.length === 0) return;
    
    // If no item is selected, select the first or last one based on direction
    if (selectedItemIndex === -1) {
        selectedItemIndex = direction === 'down' ? 0 : fileRows.length - 1;
        selectItem(fileRows[selectedItemIndex]);
        fileRows[selectedItemIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    
    let newIndex = -1;
    const currentIndex = fileRows.findIndex(row => row.classList.contains('selected'));
    
    if (currentIndex !== -1) {
        if (direction === 'up') {
            newIndex = Math.max(0, currentIndex - 1);
        } else if (direction === 'down') {
            newIndex = Math.min(fileRows.length - 1, currentIndex + 1);
        }
    } else {
        // No selection found, select first or last
        newIndex = direction === 'down' ? 0 : fileRows.length - 1;
    }
    
    if (newIndex !== -1 && newIndex !== currentIndex) {
        selectItem(fileRows[newIndex]);
        
        // Ensure the selected item is visible
        fileRows[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Execute action on selected item
function executeAction() {
    const selectedRow = document.querySelector('.netria-files tr.selected');
    if (!selectedRow) return;
    
    const isDir = selectedRow.classList.contains('dir');
    const nameCell = selectedRow.querySelector('td:last-child');
    const name = nameCell.textContent.trim().replace('/', '');
    
    if (isDir) {
        navigateTo(name);
    } else {
        openFile(name);
    }
}

// Navigate to a subdirectory
function navigateTo(dir) {
    currentPath.push(dir);
    refreshFilesList();
}

// Navigate up one directory
function navigateUp() {
    if (currentPath.length > 0) {
        currentPath.pop();
        refreshFilesList();
    }
}

// Open a file (simulated)
function openFile(filename) {
    // Find the file content from our current path
    let fileContent = fileSystem;
    const fullPath = [...currentPath, filename];
    
    for (const segment of fullPath) {
        fileContent = fileContent[segment];
    }
    
    // Get the editor content area
    const editorContent = document.querySelector('.editor-content');
    if (editorContent) {
        // Clear existing line numbers
        const lineNumbersContainer = document.querySelector('.line-numbers');
        if (lineNumbersContainer) {
            lineNumbersContainer.innerHTML = '';
        }
        
        // Set the file content directly in the editor
        editorContent.innerHTML = `<code contenteditable="true">${fileContent}</code>`;
        editorContent.style.display = 'block';
        
        // Make the editor area focusable and editable
        const codeElement = editorContent.querySelector('code');
        if (codeElement) {
            codeElement.setAttribute('tabindex', '0');
            
            // Add line numbers based on content
            const lines = fileContent.split('\n');
            if (lineNumbersContainer) {
                for (let i = 0; i < lines.length; i++) {
                    const lineNumber = document.createElement('div');
                    lineNumber.className = 'line-number';
                    lineNumber.textContent = i + 1;
                    lineNumbersContainer.appendChild(lineNumber);
                }
            }
            
            // Focus the code element after a small delay
            setTimeout(() => {
                codeElement.focus();
                
                // Set cursor at the beginning of the content
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(codeElement.firstChild, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 100);
            
            // Add event listener for Vim-like cursor styling
            codeElement.addEventListener('keydown', handleEditorKeydown);
        }
        
        // Update the title and status to show current file
        document.title = `${filename} - Netria`;
        document.querySelector('.status-filename').textContent = filename;
        document.querySelector('.status-left').textContent = 'NORMAL';
    }
    
    // Close Netria after opening a file
    closeNetria();
}

// Handle editor keydown events for Vim-like behavior
function handleEditorKeydown(event) {
    const element = event.target;
    const text = element.textContent;
    const statusMode = document.querySelector('.status-left');
    
    // Vim normal mode navigation
    if (statusMode.textContent === 'NORMAL') {
        // Handle navigation keys
        switch (event.key) {
            case 'h': // Left
                moveCursorHorizontally(-1);
                event.preventDefault();
                break;
            case 'l': // Right
                moveCursorHorizontally(1);
                event.preventDefault();
                break;
            case 'j': // Down
                moveCursorVertically(1);
                event.preventDefault();
                break;
            case 'k': // Up
                moveCursorVertically(-1);
                event.preventDefault();
                break;
            case 'i': // Enter insert mode
                statusMode.textContent = 'INSERT';
                statusMode.classList.remove('normal-mode');
                statusMode.classList.add('insert-mode');
                element.classList.remove('vim-cursor-normal');
                element.classList.add('vim-cursor-insert');
                event.preventDefault();
                break;
            case 'v': // Enter visual mode
                statusMode.textContent = 'VISUAL';
                statusMode.classList.remove('normal-mode');
                statusMode.classList.add('visual-mode');
                event.preventDefault();
                break;
            case ':': // Enter command mode
                statusMode.textContent = 'COMMAND';
                statusMode.classList.remove('normal-mode');
                statusMode.classList.add('command-mode');
                event.preventDefault();
                break;
            case 'Escape': // Back to normal mode
                statusMode.textContent = 'NORMAL';
                statusMode.classList.remove('insert-mode', 'visual-mode', 'command-mode');
                statusMode.classList.add('normal-mode');
                element.classList.remove('vim-cursor-insert');
                element.classList.add('vim-cursor-normal');
                event.preventDefault();
                break;
        }
    } else if (statusMode.textContent === 'INSERT') {
        // In insert mode, only escape goes back to normal mode
        if (event.key === 'Escape') {
            statusMode.textContent = 'NORMAL';
            statusMode.classList.remove('insert-mode');
            statusMode.classList.add('normal-mode');
            element.classList.remove('vim-cursor-insert');
            element.classList.add('vim-cursor-normal');
            event.preventDefault();
        }
    } else if (statusMode.textContent === 'VISUAL' || statusMode.textContent === 'COMMAND') {
        // In visual or command mode, escape goes back to normal mode
        if (event.key === 'Escape') {
            statusMode.textContent = 'NORMAL';
            statusMode.classList.remove('visual-mode', 'command-mode');
            statusMode.classList.add('normal-mode');
            event.preventDefault();
        }
    }
    
    // Update cursor position in status line
    updateCursorPosition();
}

// Move cursor horizontally (simulated)
function moveCursorHorizontally(direction) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;
    
    if (direction > 0 && offset < node.length) {
        range.setStart(node, offset + 1);
        range.setEnd(node, offset + 1);
    } else if (direction < 0 && offset > 0) {
        range.setStart(node, offset - 1);
        range.setEnd(node, offset - 1);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    updateCursorPosition();
}

// Move cursor vertically (simulated)
function moveCursorVertically(direction) {
    // This is a simplified implementation
    // In a real editor, you would need to calculate position more precisely
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    // Just log the action since this is a demo
    console.log(`Moving cursor ${direction > 0 ? 'down' : 'up'}`);
    
    updateCursorPosition();
}

// Update cursor position in status line
function updateCursorPosition() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const offset = range.startOffset;
    
    // Calculate line and column (simplified)
    const line = 1; // In a real implementation, calculate actual line
    const col = offset + 1;
    
    document.querySelector('.status-right').textContent = `Ln ${line}, Col ${col}`;
}

// Create File or Directory
function createFileOrDir(type) {
    // Set the current operation
    currentOperation = type === 'file' ? 'createFile' : 'createDir';
    
    // Update modal
    modalTitle.textContent = type === 'file' ? 'Create File' : 'Create Directory';
    fileOperationInput.value = '';
    fileOperationInput.placeholder = `Enter ${type} name`;
    confirmOperationBtn.textContent = 'Create';
    
    // Show modal
    fileOperationModal.classList.remove('hidden');
    fileOperationInput.focus();
}

// Delete File or Directory
function deleteFileOrDir() {
    const selectedRow = document.querySelector('.netria-files tr.selected');
    if (!selectedRow) return;
    
    const nameCell = selectedRow.querySelector('td:last-child');
    const name = nameCell.textContent.trim().replace('/', '');
    const isDir = selectedRow.classList.contains('dir');
    
    currentOperation = 'delete';
    currentOperationTarget = name;
    
    modalTitle.textContent = `Delete ${isDir ? 'Directory' : 'File'}`;
    fileOperationInput.style.display = 'none';
    confirmOperationBtn.textContent = 'Delete';
    
    // Show modal
    fileOperationModal.classList.remove('hidden');
}

// Rename File or Directory
function renameFileOrDir() {
    const selectedRow = document.querySelector('.netria-files tr.selected');
    if (!selectedRow) return;
    
    const nameCell = selectedRow.querySelector('td:last-child');
    const name = nameCell.textContent.trim().replace('/', '');
    const isDir = selectedRow.classList.contains('dir');
    
    currentOperation = 'rename';
    currentOperationTarget = name;
    
    modalTitle.textContent = `Rename ${isDir ? 'Directory' : 'File'}`;
    fileOperationInput.style.display = 'block';
    fileOperationInput.value = name;
    fileOperationInput.placeholder = `Enter new name`;
    confirmOperationBtn.textContent = 'Rename';
    
    // Show modal
    fileOperationModal.classList.remove('hidden');
}

// Confirm File Operation
function confirmFileOperation() {
    switch (currentOperation) {
        case 'createFile':
            const fileName = fileOperationInput.value.trim();
            if (fileName) {
                // Simulate file creation
                currentDirectory[fileName] = `// New file: ${fileName}\n`;
                refreshFilesList();
            }
            break;
            
        case 'createDir':
            const dirName = fileOperationInput.value.trim();
            if (dirName) {
                // Simulate directory creation
                currentDirectory[dirName] = {};
                refreshFilesList();
            }
            break;
            
        case 'delete':
            if (currentOperationTarget) {
                // Simulate deletion
                delete currentDirectory[currentOperationTarget];
                refreshFilesList();
            }
            break;
            
        case 'rename':
            const newName = fileOperationInput.value.trim();
            if (newName && currentOperationTarget && newName !== currentOperationTarget) {
                // Simulate rename
                currentDirectory[newName] = currentDirectory[currentOperationTarget];
                delete currentDirectory[currentOperationTarget];
                refreshFilesList();
            }
            break;
    }
    
    // Close modal
    fileOperationModal.classList.add('hidden');
    currentOperation = null;
    currentOperationTarget = null;
}

// Cancel File Operation
function cancelFileOperation() {
    fileOperationModal.classList.add('hidden');
    currentOperation = null;
    currentOperationTarget = null;
}

// Apply configuration
function applyConfiguration() {
    // Get values from config panel
    config.title = document.getElementById('title').value;
    config.width = parseFloat(document.getElementById('width').value);
    config.height = parseFloat(document.getElementById('height').value);
    config.border = true; // Always enabled
    config.border_style = document.getElementById('border-style').value;
    config.show_line_numbers = document.getElementById('show-line-numbers').checked;
    config.enable_banner = document.getElementById('enable-banner').checked;
    
    // Apply configuration
    if (netriaWindow.classList.contains('hidden')) {
        openNetria();
    } else {
        openNetria(); // Re-open to apply settings
    }
    
    // Hide config panel
    configPanel.classList.add('hidden');
}

// Initialize configuration panel
function initConfigPanel() {
    document.getElementById('title').value = config.title;
    document.getElementById('width').value = config.width;
    document.getElementById('height').value = config.height;
    document.getElementById('border-style').value = config.border_style;
    document.getElementById('show-line-numbers').checked = config.show_line_numbers;
    document.getElementById('enable-banner').checked = config.enable_banner;
    
    // Update value displays
    document.getElementById('width-value').textContent = config.width;
    document.getElementById('height-value').textContent = config.height;
    
    // Setup range input listeners
    document.getElementById('width').addEventListener('input', function() {
        document.getElementById('width-value').textContent = this.value;
    });
    
    document.getElementById('height').addEventListener('input', function() {
        document.getElementById('height-value').textContent = this.value;
    });
}

// Event listeners - Updated to handle the duplicate toggle buttons properly
// Remove single event listener for toggle button
toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Toggle button clicked');
        toggleNetria();
    });
});

refreshBtn.addEventListener('click', () => {
    // Add rotation animation
    refreshBtn.querySelector('i').style.animation = 'spin 0.6s ease';
    setTimeout(() => {
        refreshBtn.querySelector('i').style.animation = '';
    }, 600);
    refreshFilesList();
});

configBtn.addEventListener('click', (event) => {
    // Toggle dropdown visibility
    const isDropdownHidden = configDropdown.classList.contains('hidden');
    
    if (isDropdownHidden) {
        // Close any open config panel first
        configPanel.classList.add('hidden');
        
        // Show dropdown
        configDropdown.classList.remove('hidden');
        
        // Ensure the dropdown is correctly positioned
        const btnRect = configBtn.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if the dropdown would go off-screen
        const dropdownHeight = configDropdown.offsetHeight || 200; // Estimate if not yet visible
        if (btnRect.bottom + dropdownHeight + 10 > viewportHeight) {
            // Position above the button if it would go off-screen
            configDropdown.style.top = 'auto';
            configDropdown.style.bottom = '100%';
            configDropdown.style.marginTop = '0';
            configDropdown.style.marginBottom = '10px';
        } else {
            // Position below the button (default)
            configDropdown.style.top = '100%';
            configDropdown.style.bottom = 'auto';
            configDropdown.style.marginTop = '10px';
            configDropdown.style.marginBottom = '0';
        }
    } else {
        // Hide dropdown
        configDropdown.classList.add('hidden');
    }
    
    // Stop propagation to prevent document click handler from immediately closing it
    event.stopPropagation();
});

// Config dropdown handlers
document.querySelectorAll('#config-dropdown li').forEach(item => {
    item.addEventListener('click', function(event) {
        event.stopPropagation();
        
        const action = this.getAttribute('data-action');
        
        if (action === 'toggle-panel') {
            // Toggle the full settings panel
            initConfigPanel();
            configDropdown.classList.add('hidden');
            
            // Position and show the config panel
            const btnRect = configBtn.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            // Handle positioning based on screen size
            if (viewportWidth <= 768) {
                // Mobile view - center the panel
                configPanel.style.top = (btnRect.bottom + 10) + 'px';
                configPanel.style.left = '50%';
                configPanel.style.right = 'auto';
                configPanel.style.transform = 'translateX(-50%)';
            } else {
                // Desktop view - align with the right edge of the button
                configPanel.style.top = (btnRect.bottom + 10) + 'px';
                configPanel.style.right = Math.max(10, viewportWidth - btnRect.right) + 'px';
                configPanel.style.left = 'auto';
                configPanel.style.transform = 'none';
            }
            
            // Ensure solid background
            configPanel.style.backgroundColor = '#1e1e2e';
            configPanel.style.background = '#1e1e2e';
            configPanel.style.zIndex = '10000'; // Match the dropdown z-index
            
            // Show the panel
            configPanel.classList.remove('hidden');
            
        } else if (action === 'toggle-banner') {
            // Toggle banner
            config.enable_banner = !config.enable_banner;
            if (netriaWindow.classList.contains('hidden')) {
                openNetria();
            } else {
                netriaBanner.style.display = config.enable_banner ? 'block' : 'none';
            }
            
        } else if (action === 'toggle-numbers') {
            // Toggle line numbers
            config.show_line_numbers = !config.show_line_numbers;
            const lineNumbers = document.querySelectorAll('.line-number');
            if (config.show_line_numbers) {
                lineNumbers.forEach(ln => ln.style.display = 'table-cell');
            } else {
                lineNumbers.forEach(ln => ln.style.display = 'none');
            }
        }
        
        // Hide dropdown after action (except for toggle-panel)
        if (action !== 'toggle-panel') {
            configDropdown.classList.add('hidden');
        }
    });
});

applyConfigBtn.addEventListener('click', () => {
    applyConfiguration();
    // Add flash animation
    applyConfigBtn.style.animation = 'flash 0.6s';
    setTimeout(() => {
        applyConfigBtn.style.animation = '';
        // Hide the config panel after applying
        configPanel.classList.add('hidden');
    }, 600);
});

netriaClose.addEventListener('click', closeNetria);

// File Operation Modal listeners
confirmOperationBtn.addEventListener('click', confirmFileOperation);
cancelOperationBtn.addEventListener('click', cancelFileOperation);

// Close panels when clicking outside
document.addEventListener('click', function(event) {
    const clickedToggleBtn = Array.from(toggleBtns).some(btn => btn.contains(event.target));
    const clickedConfigBtn = configBtn.contains(event.target);
    const clickedConfigDropdown = configDropdown.contains(event.target);
    
    if (!netriaWindow.contains(event.target) && 
        !clickedToggleBtn && 
        !clickedConfigBtn) {
        
        if (!netriaWindow.classList.contains('hidden') && 
            !event.target.closest('.netria-window')) {
            closeNetria();
        }
    }
    
    if (!configPanel.contains(event.target) && 
        !clickedConfigBtn && 
        !clickedConfigDropdown) {
        if (!configPanel.classList.contains('hidden')) {
            configPanel.classList.add('hidden');
        }
    }
    
    if (!configDropdown.contains(event.target) && 
        !clickedConfigBtn) {
        if (!configDropdown.classList.contains('hidden')) {
            configDropdown.classList.add('hidden');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Skip if we're in an input field, text area, or code editor
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA' || 
        document.activeElement.tagName === 'CODE') {
        return;
    }
    
    // 'e' key is now handled in separate event listener
    
    // Only process when Netria is open and modal is not open
    if (!netriaWindow.classList.contains('hidden') && fileOperationModal.classList.contains('hidden')) {
        switch(event.key) {
            case 'j':
                navigateList('down');
                event.preventDefault();
                break;
            case 'k':
                navigateList('up');
                event.preventDefault();
                break;
            case 'Enter':
                executeAction();
                event.preventDefault();
                break;
            case '-':
                navigateUp();
                event.preventDefault();
                break;
            case 'd':
                createFileOrDir('directory');
                event.preventDefault();
                break;
            case '%':
                createFileOrDir('file');
                event.preventDefault();
                break;
            case 'D':
                deleteFileOrDir();
                event.preventDefault();
                break;
            case 'R':
                renameFileOrDir();
                event.preventDefault();
                break;
            case 'q':
                closeNetria();
                event.preventDefault();
                break;
            case 'Escape':
                closeNetria();
                event.preventDefault();
                break;
        }
    }
    
    // Handle Escape key for modals
    if (event.key === 'Escape') {
        if (!fileOperationModal.classList.contains('hidden')) {
            cancelFileOperation();
            event.preventDefault();
        } else if (!configPanel.classList.contains('hidden')) {
            configPanel.classList.add('hidden');
            event.preventDefault();
        }
    }
    
    // Handle Enter key for file operation modal
    if (event.key === 'Enter' && !fileOperationModal.classList.contains('hidden')) {
        confirmFileOperation();
        event.preventDefault();
    }
});

// Initialize on load with enhanced animations and styling
document.addEventListener('DOMContentLoaded', function() {
    // Fix image paths for before/after screenshots
    const images = document.querySelectorAll('.screenshot-container img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src.startsWith('../assets/')) {
            img.setAttribute('src', src.replace('../assets/', 'https://github.com/Mirhajian/netria/raw/main/assets/'));
        }
    });
    
    // Add hover effects to keyboard shortcuts
    const shortcutRows = document.querySelectorAll('.keyboard-shortcuts table tr');
    shortcutRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(114, 137, 218, 0.1)';
            this.style.transition = 'background-color 0.2s ease';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Add subtle hover effects to file items
    const enhanceFileItemsAnimation = () => {
        const fileItems = document.querySelectorAll('.netria-files tr:not(.path-display)');
        fileItems.forEach((item, index) => {
            // Reset any existing animations for refreshed items
            item.style.animation = '';
            item.style.opacity = '1';
            
            // Add subtle hover effect
            item.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateX(5px)';
                    this.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = '';
                }
            });
        });
    };
    
    // Call initially and hook into refreshFilesList
    const originalRefreshFilesList = refreshFilesList;
    refreshFilesList = function() {
        originalRefreshFilesList();
        setTimeout(enhanceFileItemsAnimation, 100); // Short delay to ensure DOM is updated
    };
    
    // Enhance screenshot containers with zoom effect
    const screenshotImages = document.querySelectorAll('.screenshot-container img');
    screenshotImages.forEach(img => {
        img.parentElement.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.02)';
            img.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        });
        
        img.parentElement.addEventListener('mouseleave', function() {
            img.style.transform = '';
        });
    });
    
    // Always auto-open Netria
    setTimeout(() => {
        openNetria();
    }, 800); // Slightly longer delay for better visual effect after page load
});

// Handle window resize for config panel positioning
window.addEventListener('resize', function() {
    // If config panel is visible, reposition it
    if (!configPanel.classList.contains('hidden') && configBtn) {
        const btnRect = configBtn.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Handle positioning based on screen size
        if (viewportWidth <= 768) {
            // Mobile view - center the panel
            configPanel.style.top = (btnRect.bottom + 10) + 'px';
            configPanel.style.left = '50%';
            configPanel.style.right = 'auto';
            configPanel.style.transform = 'translateX(-50%)';
        } else {
            // Desktop view - align with the right edge of the button
            configPanel.style.top = (btnRect.bottom + 10) + 'px';
            configPanel.style.right = Math.max(10, viewportWidth - btnRect.right) + 'px';
            configPanel.style.left = 'auto';
            configPanel.style.transform = 'none';
        }
        
        // Update max height based on viewport
        const maxHeight = window.innerHeight - btnRect.bottom - 20; // 20px buffer
        configPanel.style.maxHeight = maxHeight + 'px';
    }
});

// Initialize all components
function initializeComponents() {
    // Setup quick action dropdowns
    initConfigPanel();
    
    // Make sure all elements are found
    if (!configDropdown) {
        console.error('Config dropdown not found in DOM');
    } else {
        // Ensure dropdown has the highest z-index
        configDropdown.style.zIndex = '10000';
        
        // Ensure the config toggle container has high z-index
        const configToggle = document.querySelector('.config-toggle');
        if (configToggle) {
            configToggle.style.zIndex = '10000';
        }
        
        // Pre-calculate dropdown height for better positioning
        configDropdown.classList.remove('hidden');
        const dropdownHeight = configDropdown.offsetHeight;
        configDropdown.classList.add('hidden');
    }
    
    // Configure the config panel
    if (configPanel) {
        configPanel.style.backgroundColor = 'var(--panel-bg)';
        configPanel.style.background = 'var(--panel-bg)';
        configPanel.style.zIndex = '10000';
        
        // Ensure all inputs have proper backgrounds
        const configInputs = configPanel.querySelectorAll('input, select');
        configInputs.forEach(input => {
            if (input.type === 'checkbox') {
                // Checkbox styles handled by CSS
            } else if (input.type === 'range') {
                // Range slider styles handled by CSS
            } else {
                input.style.backgroundColor = 'var(--button-secondary-bg)';
                input.style.background = 'var(--button-secondary-bg)';
            }
        });
    }
    
    // Make sure submenu positioning is correct
    const submenuItems = document.querySelectorAll('.config-dropdown .submenu');
    submenuItems.forEach(submenu => {
        const parentWidth = submenu.parentElement.offsetWidth;
        submenu.style.width = Math.max(160, parentWidth * 0.8) + 'px';
        submenu.style.zIndex = '10001'; // Ensure submenus are also on top
    });
}

// Theme toggling
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
        
        // Check for saved preference
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'false') {
            document.body.classList.remove('dark-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
    }
});

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

function enhanceUIComponents() {
    const configDropdown = document.getElementById('config-dropdown');
    const configToggle = document.querySelector('.config-toggle');
    const configPanel = document.getElementById('config-panel');
    
    // Ensure the dropdown has proper z-index
    if (configDropdown) {
        configDropdown.style.zIndex = '10000';
        if (configToggle) {
            configToggle.style.zIndex = '10000';
        }
        
        // Pre-calculate dropdown height for better positioning
        configDropdown.classList.remove('hidden');
        const dropdownHeight = configDropdown.offsetHeight;
        configDropdown.classList.add('hidden');
    }
    
    // Configure the config panel
    if (configPanel) {
        configPanel.style.backgroundColor = 'var(--panel-bg)';
        configPanel.style.background = 'var(--panel-bg)';
        configPanel.style.zIndex = '10000';
        
        // Ensure all inputs have proper backgrounds
        const configInputs = configPanel.querySelectorAll('input, select');
        configInputs.forEach(input => {
            if (input.type === 'checkbox') {
                // Checkbox styles handled by CSS
            } else if (input.type === 'range') {
                // Range slider styles handled by CSS
            } else {
                input.style.backgroundColor = 'var(--button-secondary-bg)';
                input.style.background = 'var(--button-secondary-bg)';
            }
        });
    }
    
    // Make sure submenu positioning is correct
    const submenuItems = document.querySelectorAll('.config-dropdown .submenu');
    submenuItems.forEach(submenu => {
        const parentWidth = submenu.parentElement.offsetWidth;
        submenu.style.width = Math.max(160, parentWidth * 0.8) + 'px';
        submenu.style.zIndex = '10001'; // Ensure submenus are also on top
    });
} 