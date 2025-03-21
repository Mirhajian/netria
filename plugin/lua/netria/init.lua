local M = {}

local config = require('netria.config')
local ui = require('netria.ui')
local state = require('netria.state')
local netrw = require('netria.netrw')
local commands = require('netria.commands')
local events = require('netria.events')

-- Open the floating netrw window
function M.open(directory)
  ui.open(directory)
end

-- Close the floating netrw window
function M.close()
  ui.close()
end

-- Toggle the floating netrw window
function M.toggle(directory)
  ui.toggle(directory)
end

-- Setup function
function M.setup(opts)
  -- Merge user config with defaults
  config.update(opts or {})
  
  -- Initialize state
  state.initialize()
  
  -- Set up netrw hooks for directory tracking
  netrw.setup_hooks()
  
  -- Create user commands
  commands.setup(M)
  
  -- Set up event handlers
  events.setup()
  
  -- Handle directory arguments on VimEnter
  vim.api.nvim_create_autocmd("VimEnter", {
    callback = function()
      -- Only run once at startup
      if not state.initialized then
        state.initialized = true
        
        -- Check if we started with a directory argument
        if netrw.handle_directory_args() then
          -- Make sure to use vim.schedule to ensure proper timing
          vim.schedule(function()
          -- Open explorer with the directory
            M.open(state.current_dir)
          end)
          
          -- Map q in netrw buffer to quit completely
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
