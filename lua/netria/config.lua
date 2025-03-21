local M = {}

-- Default configuration
M.defaults = {
  title = " Netria ",
  position = "center",
  centered = true,
  width = 0.7,
  height = 0.8,
  
  border = true,
  border_style = "rounded",
  
  hide_banner = true,
  liststyle = 3,
  winsize = 0,
  show_line_numbers = true,
  show_relative_numbers = true,
  no_modify = true,
  readonly = true,
  no_wrap = true,

  apply_numbers_to_files = true,

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

M.values = vim.deepcopy(M.defaults)

function M.update(opts)
  M.values = vim.tbl_deep_extend("force", M.defaults, opts)
end

function M.setup(opts)
  M.update(opts or {})
end

return M
