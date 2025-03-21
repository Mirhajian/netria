local M = {}

-- Default configuration
M.defaults = {
  -- Window appearance
  title = " Netria ",
  position = "center",        -- It could be "center", "left", "right"
  centered = true,            -- Center the netrw window
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

  -- File buffer settings
  apply_numbers_to_files = true, -- Apply number settings to opened files as well

  banner = {
    enabled = true,
        art = {
        "",
        "███╗   ██╗███████╗████████╗██████╗ ██╗ █████╗    ┌───────────────────────────────┐",
        "████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗   │ Netria - A Nice Looking Netrw │",
        "██╔██╗ ██║█████╗     ██║   ██████╔╝██║███████║   │ Version: 1.0.0                │",
        "██║╚██╗██║██╔══╝     ██║   ██╔══██╗██║██╔══██║   │ :Netria - Open Explorer       │",
        "██║ ╚████║███████╗   ██║   ██║  ██║██║██║  ██║   │ :NetriaToggle - Toggle Netria │",
        "╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   └───────────────────────────────┘",
        ""
    },
  },
}

-- Active configuration
M.values = vim.deepcopy(M.defaults)

-- Update configuration with user values
function M.update(opts)
  M.values = vim.tbl_deep_extend("force", M.defaults, opts)
end

-- Added for compatibility with netria.lua
function M.setup(opts)
  M.update(opts or {})
end

return M
