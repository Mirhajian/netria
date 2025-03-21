<div align="center">

# 🌟 Netria

*A clean, modern floating UI for Netrw in Neovim*

[![Neovim](https://img.shields.io/badge/NeoVim-%2357A143.svg?&style=for-the-badge&logo=neovim&logoColor=white)](https://neovim.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Mirhajian/netria?style=for-the-badge)](https://github.com/Mirhajian/netria/stargazers)

[![asciicast](https://asciinema.org/a/d3IIEbQO0Y4Laoz1BZJrGOsYZ.svg)](https://asciinema.org/a/d3IIEbQO0Y4Laoz1BZJrGOsYZ)

*Enhance Netrw with minimal configuration*

</div>

## ✨ Features

- Transforms Netrw into a beautiful floating window
- Clean, customizable UI with configurable borders
- Custom banner with ASCII art
- Works with your existing Netrw keybindings
- No dependencies beyond Neovim's built-in Netrw
- Lightweight and focused on enhancing what's already there

## 📸 Screenshots

<div align="center">
  <p><strong>Before: Standard Netrw</strong></p>
  <img src="https://github.com/Mirhajian/netria/raw/main/assets/before.png" width="600" />
  
  <p><strong>After: Netria</strong></p>
  <img src="https://github.com/Mirhajian/netria/raw/main/assets/after.png" width="600" />
</div>

## 📦 Installation

<details>
<summary><b>lazy.nvim</b></summary>

```lua
{
  "mirhajian/netria",
  config = function()
    require("netria").setup({
      -- optional configuration here
    })
  end,
}
```
</details>

<details>
<summary><b>packer.nvim</b></summary>

```lua
use {
  "mirhajian/netria",
  config = function()
    require("netria").setup({})
  end
}
```
</details>

<details>
<summary><b>vim-plug</b></summary>

```vim
Plug 'mirhajian/netria'

" In your init.vim after plug#end()
lua require('netria').setup({})
```
</details>

## 🚀 Usage

### Commands

| Command | Description |
|---------|-------------|
| `:NetriaOpen [path]` | Open Netria (optionally at specified path) |
| `:NetriaClose` | Close Netria window |
| `:NetriaToggle [path]` | Toggle Netria visibility (optionally at specified path) |
| `:NetriaRefresh` | Refresh the current view |

### 💡 Standard Netrw Keybindings Still Work!

| Key | Action |
|-----|--------|
| `<CR>` | Open file/directory |
| `d` | Create directory |
| `%` | Create file |
| `D` | Delete file/directory |
| `R` | Rename file/directory |
| `i` | Change list style |
| `-` | Go up one directory |

## 🔧 Configuration

Netria works out of the box, but you can customize it:

```lua
-- Disable netrw's automatic directory handling
vim.g.netrw_keepdir = 1

require('netria').setup({
  -- Window appearance
  title = " Netria ",
  position = "center",        -- It could be "center", "left", "right"
  centered = true,
  width = 0.7,                -- Width as percentage of screen (0.0-1.0)
  height = 0.8,               -- Height as percentage of screen (0.0-1.0)
  
  -- Border options
  border = true,              -- Enable border around netrw
  border_style = "rounded",   -- Options: "none", "single", "double", "rounded", "solid", "shadow"
  
  -- Netrw settings
  hide_banner = true,         -- Hide the default netrw banner
  liststyle = 3,              -- Tree style listing
  winsize = 0,                -- Let our plugin handle sizing
  show_line_numbers = true,   -- Show line numbers
  show_relative_numbers = true, -- Show relative line numbers
  no_modify = true,           -- No modifications allowed in netrw buffer
  readonly = true,            -- Read-only mode
  no_wrap = true,             -- No text wrapping

  banner = {
    enabled = true,
    art = {
        "",
        "███╗   ██╗███████╗████████╗██████╗ ██╗ █████╗    ┌───────────────────────────────┐",
        "████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗   │ Netria - A Nice Looking Netrw │",
        "██╔██╗ ██║█████╗     ██║   ██████╔╝██║███████║   │ Version: 1.0.0                │",
        "██║╚██╗██║██╔══╝     ██║   ██╔══██╗██║██╔══██║   │ :Netria - Open Explorer       │",
        "██║ ╚████║███████╗   ██║   ██║  ██║██║██║  ██║   │ :NetriaToggle - Toggle Nerria │",
        "╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   └───────────────────────────────┘",
        ""
    },
  },
})

-- Set up a keymap to toggle the explorer
vim.keymap.set('n', '<leader>e', require('netria').toggle, { desc = "Toggle Netria" })

```

## 🤝 Compatibility and Best Practices

Netria enhances Netrw rather than replacing it, making it compatible with:

- Projects that rely on standard Netrw behavior
- Most Neovim configurations and workflows
- Netrw key mappings and settings you already know

### Known Limitations

- Custom banner may need adjustment for very narrow window sizes
- Some Netrw plugin configurations might affect behavior

### Donations

If you enjoy this project and want to support its continued development (or just want to buy me a coffee), consider donating! Here are a few ways you can do that:



- Buy Me a Coffee:

For the fellows from Iran ❤️:

- Coffee Bede:

  [![Support me on CoffeeBede](https://coffeebede.ir/DashboardTemplateV2/app-assets/images/banner/default-yellow.svg)](https://www.coffeebede.com/abolafzlmirhajian)


---
<div align="center">
  <p>Made with ❤️ for the Neovim community</p>
</div>
