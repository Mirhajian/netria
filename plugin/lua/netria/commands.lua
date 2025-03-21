local M = {}

local config = require('netria.config')
local state = require('netria.state')
local ui = require('netria.ui')

function M.setup(api)
  -- If api is not provided, use internal ui module
  api = api or ui
  
  -- Create user commands
  vim.api.nvim_create_user_command("NetriaOpen", function(cmd_opts)
    local dir = cmd_opts.args ~= "" and cmd_opts.args or nil
    api.open(dir)
  end, {nargs = "?"})
  
  vim.api.nvim_create_user_command("NetriaClose", api.close, {})
  
  vim.api.nvim_create_user_command("NetriaToggle", function(cmd_opts)
    local dir = cmd_opts.args ~= "" and cmd_opts.args or nil
    api.toggle(dir)
  end, {nargs = "?"})
  
  -- Add command to force a complete quit
  vim.api.nvim_create_user_command("NetriaQuit", function()
    vim.cmd("qa")
  end, {})
  
  -- Add a refresh command that readds the banner
  vim.api.nvim_create_user_command("NetriaRefresh", function()
    if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
      local buf = vim.api.nvim_win_get_buf(state.win_id)
      if state.is_netrw_buffer(buf) then
        local banner = require('netria.banner')
        banner.add_custom_banner(buf, state.win_id)
      end
    end
  end, {})
  
  -- Apply number settings to all existing windows if we're applying to files
  if config.values.apply_numbers_to_files then
    for _, win_id in ipairs(vim.api.nvim_list_wins()) do
      local buf_id = vim.api.nvim_win_get_buf(win_id)
      if not state.is_netrw_buffer(buf_id) then
        if config.values.show_line_numbers then
          vim.wo[win_id].number = true
        end
        
        if config.values.show_relative_numbers then
          vim.wo[win_id].relativenumber = true
        end
      end
    end
  end
end

return M
