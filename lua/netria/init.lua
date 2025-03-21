local M = {}

local config = require('netria.config')
local ui = require('netria.ui')
local state = require('netria.state')
local netrw = require('netria.netrw')
local commands = require('netria.commands')
local events = require('netria.events')

-- open the floating netrw window
function M.open(directory)
  ui.open(directory)
end

-- close the floating netrw window
function M.close()
  ui.close()
end

-- roggle the floating netrw window
function M.toggle(directory)
  ui.toggle(directory)
end

function M.setup(opts)
  -- merge user config with defaults
  config.update(opts or {})
  
  state.initialize()
  netrw.setup_hooks()
  commands.setup(M)
  
  events.setup()
  
  vim.api.nvim_create_autocmd("VimEnter", {
    callback = function()
      if not state.initialized then
        state.initialized = true
        
        if netrw.handle_directory_args() then
          vim.schedule(function()
            M.open(state.current_dir)
          end)
          
          vim.api.nvim_create_autocmd("FileType", {
            pattern = "netrw",
            callback = function()
              vim.api.nvim_buf_set_keymap(0, "n", "q", 
                ":qa<CR>", {noremap = true, silent = true})
            end
          })
        end
      end
    end,
    once = true
  })
end

return M
